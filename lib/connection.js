/*!
 * Module dependencies.
 */

const WebSocketAsPromised = require('websocket-as-promised');
const WebSocket = require('ws');
const STATES = require('./connectionstate');

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
  this.tables = {};
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
  if (typeof base === 'undefined' || !base.connections.length) {
    this.id = 0;
  } else {
    this.id = base.connections.length;
  }
  this._queue = [];
}

/*!
 * Inherit from EventEmitter
 */

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

_this = this;

Connection.prototype.connect = async (host, port, callback) => {
  this._wsp = new WebSocketAsPromised(`ws://${host}:${port}`, {
    packMessage: (data) => JSON.stringify(data),
    unpackMessage: (data) => JSON.parse(data),
    extractMessageData: (event) => event,
    createWebSocket: (url) => new WebSocket(url),
    attachRequestId: (data, requestId) =>
      Object.assign({ id: requestId }, data), // attach requestId to message as `id` field
    extractRequestId: (data) => data && data.id, // read requestId from message `id` field
  });

  await this._wsp.open();

  return this;
};

Connection.prototype.close = (callback) => {
  _this.readyState = STATES.disconnecting;
  _this._closeCalled = true;
  _this._wsp.close().then(callback);
};

/*!
 * Module exports.
 */
Connection.STATES = STATES;

/*!
 * Module exports.
 */
const connection = (module.exports = exports = Connection);
