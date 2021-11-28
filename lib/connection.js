const WebSocketAsPromised = require('websocket-as-promised');
const WebSocket = require('ws');
const STATES = require('./connectionstate');
const { convertFromNumType } = require('./schema-types');

class Connection {
  static STATES = STATES;
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
  constructor(base) {
    this.base = base;
    this.models = {};
    this._wsp = null;
    this.states = STATES;
    this.readyState = STATES.disconnected;
    this._closeCalled = false;
    this._hasOpened = false;
  }

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
  async connect(host, port) {
    this._wsp = new WebSocketAsPromised(`ws://${host}:${port}`, {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data),
      extractMessageData: (event) => event,
      createWebSocket: (url) => new WebSocket(url),
      attachRequestId: (data, requestId) =>
        Object.assign({ id: requestId }, data), // attach requestId to message as `id` field
      extractRequestId: (data) => data && data.id, // read requestId from message `id` field
    });

    this.readyState = STATES.connecting;

    await this._wsp.open();

    this.readyState = STATES.connected;
    this._closeCalled = false;

    return this;
  }

  /**
   * Closes the connection instance.
   *
   * @param {Function} [callback] the callback function to call when the connection is closed
   * @returns {Void}
   * @api public
   */
  async close() {
    this.readyState = STATES.disconnecting;
    this.closeCalled = true;

    await this._wsp.close();
  }

  /**
   * Geth the current table type schema for a specific table name
   *
   * ####Example:
   *
   *     const connection = new Connection();
   *
   *     const [table_type_schema, table_size] = conn.getCurrentTableTypeSchema('trades');
   *
   *     // table_type_schema = { date: { type: KDate }, time: { type: Time } , sym :{ type: Symbol }}
   *     // table_size = 0
   *
   * @param {String} table_name the name of the table in Kdb
   * @returns {List} a list with two outputs: [table type schema object, table size]
   * @api public
   */
  async getCurrentTableTypeSchema(table_name, cheetah) {
    // query for the table schema in Kdb+

    const cols = await this._sendQuery(`cols ${table_name}`);
    const table_type_schema = {};
    for (let col of cols) {
      const numType = await this._sendQuery(
        `type exec ${col} from ${table_name}`
      );

      table_type_schema[col] = { type: convertFromNumType(numType) };
    }

    // get the size of the table
    const table_size = await this._sendQuery(`count select from ${table_name}`);

    return [table_type_schema, table_size];
  }

  async _sendQuery(query) {
    // check if this connected is in state 'connected'
    if (this.readyState !== STATES.connected) {
      throw new Error(
        'Tried to query table schema on a connected that is not connected'
      );
    }

    // send the query to the database and return the result
    const { result } = await this._wsp.sendRequest({ query: query });

    return result;
  }
}

module.exports = Connection;
