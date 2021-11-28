/*!
 * Module dependencies.
 */

const WebSocketAsPromised = require('websocket-as-promised');
const WebSocket = require('ws');
const STATES = require('./connectionstate');
const { convertFromNumType } = require('./schema-types');
const EventEmitter = require('events').EventEmitter;

/**
 * Connection constructor
 *
 * For practical reasons, a Connection equals a Db.
 *
 * @param {Cheetah} base a cheetah instance
 * @inherits NodeJS EventEmitter http://nodejs.org/api/events.html#events_class_events_eventemitter
 * @event `connecting`: Emitted when `connection.openUri()` is executed on this connection.
 * @event `connected`: Emitted when this connection successfully connects to the db. May be emitted _multiple_ times in `reconnected` scenarios.
 * @event `open`: Emitted after we `connected` and `onOpen` is executed on all of this connections models.
 * @event `disconnecting`: Emitted when `connection.close()` was executed.
 * @event `disconnected`: Emitted after getting disconnected from the db.
 * @event `close`: Emitted after we `disconnected` and `onClose` executed on all of this connections models.
 * @event `reconnected`: Emitted after we `connected` and subsequently `disconnected`, followed by successfully another successful connection.
 * @event `error`: Emitted when an error occurs on this connection.
 * @event `fullsetup`: Emitted after the driver has connected to primary and all secondaries if specified in the connection string.
 * @api public
 */

function Connection(base) {
  this.base = base;
  // this.collections = {};
  this.models = {};
  this._wsp = null;
  // this.config = {};
  // this.replica = false;
  // this.options = null;
  // this.otherDbs = []; // FIXME: To be replaced with relatedDbs
  // this.relatedDbs = {}; // Hashmap of other dbs that share underlying connection
  this.states = STATES;
  this._readyState = STATES.disconnected;
  this._closeCalled = false;
  this._hasOpened = false;
  // this.plugins = [];
  // this._queue = [];
}

/*!
 * Inherit from EventEmitter
 */

//Connection.prototype = new EventEmitter();

// Connection.prototype.__proto__ = EventEmitter.prototype;

/**
 * Connection ready state
 *
 * - 0 = disconnected
 * - 1 = connected
 * - 2 = connecting
 * - 3 = disconnecting
 *
 * Each state change emits its associated event name.
 *
 * ####Example
 *
 *     conn.on('connected', callback);
 *     conn.on('disconnected', callback);
 *
 * @property readyState
 * @memberOf Connection
 * @instance
 * @api public
 */

Object.defineProperty(Connection.prototype, 'readyState', {
  get: function () {
    return this._readyState;
  },
  set: function (val) {
    if (!(val in STATES)) {
      throw new Error('Invalid connection state: ' + val);
    }

    if (this._readyState !== val) {
      this._readyState = val;
      // [legacy] loop over the otherDbs on this connection and change their state
      for (const db of this.otherDbs) {
        db.readyState = val;
      }

      if (STATES.connected === val) {
        this._hasOpened = true;
      }

      this.emit(STATES[val]);
    }
  },
});

_this = this;

/**
 * Opens the connection with a host and port using `node-q package()`.
 *
 * @param {String} host The host to connect with.
 * @param {String} port The port to connect with.
 * @param {Object} [options] Passed on to http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
 * @param {String} [options.user] username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility.
 * @param {String} [options.pass] password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility.
 * @param {Function} [callback]
 * @returns {Connection} this
 * @api public
 */
Connection.prototype.connect = async (host, port, callback) => {
  _this._wsp = new WebSocketAsPromised(`ws://${host}:${port}`, {
    packMessage: (data) => JSON.stringify(data),
    unpackMessage: (data) => JSON.parse(data),
    extractMessageData: (event) => event,
    createWebSocket: (url) => new WebSocket(url),
    attachRequestId: (data, requestId) =>
      Object.assign({ id: requestId }, data), // attach requestId to message as `id` field
    extractRequestId: (data) => data && data.id, // read requestId from message `id` field
  });

  _this.readyState = STATES.connecting;

  await _this._wsp.open();

  _this.readyState = STATES.connected;
  _this._closeCalled = false;

  return _this;
};

Connection.prototype._sendQuery = async function (query) {
  // check if this connected is in state 'connected'
  if (_this.readyState !== STATES.connected) {
    throw new Error(
      'Tried to query table schema on a connected that is not connected'
    );
  }

  console.log(query);

  // send the query to the database and return the result
  const result = await _this._wsp.sendRequest({ query: query });

  return result;
};

Connection.prototype.close = function (callback) {
  _this.readyState = STATES.disconnecting;
  _this.closeCalled = true;

  if (!callback) {
    callback = () => {};
  }

  _this._wsp.close().then(callback);
};

Connection.prototype.getCurrentTableTypeSchema = async function (
  table_name,
  cheetah
) {
  // check if this instance of cheetah is the same as the one inputted
  if (cheetah !== this.base) {
    throw new Error(
      'Cheetah instance inputted is not the same as the the one for this connection'
    );
  }

  // query for the table schema in Kdb+
  const cols_string = await this._sendQuery(`cols ${table_name}`);
  const cols = cols_string.substr(1).split('`');
  const table_type_schema = {};
  for (let col of cols) {
    var numType = await this._sendQuery(`type exec ${col} from ${table_name}`);

    // if numType has h as a delimeter (to denote a short) remove it
    numType = numType.replace('h', '');

    // convert numType to an integer
    numType = +numType;

    table_type_schema[col] = { type: convertFromNumType(numType) };
  }

  // get the size of the table
  const table_size = await this._sendQuery(`count select from ${table_name}`);

  return [table_type_schema, table_size];
};

/**
 * Called when the connection is opened
 *
 * @api private
 */

Connection.prototype.onOpen = function () {
  this.readyState = STATES.connected;

  for (const d of this._queue) {
    d.fn.apply(d.ctx, d.args);
  }
  this._queue = [];

  // avoid having the collection subscribe to our event emitter
  // to prevent 0.3 warning
  for (const i in this.collections) {
    if (utils.object.hasOwnProperty(this.collections, i)) {
      this.collections[i].onOpen();
    }
  }

  this.emit('open');
};

/*!
 * Module exports.
 */
Connection.STATES = STATES;

/*!
 * Module exports.
 */
const connection = (module.exports = exports = Connection);
