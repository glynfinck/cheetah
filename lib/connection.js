const WebSocketAsPromised = require('websocket-as-promised');
const WebSocket = require('ws');
const STATES = require('./connectionstate');
const { convertFromNumType, convertFromTypeToKdb } = require('./schema-types');
const utils = require('./utils');

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
    // this.models = {};
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

  async createTable(table_name, new_schema, cheetah) {
    const schema_strings = [];
    const new_schema_obj = new_schema.schema;
    for (let key of Object.keys(new_schema_obj)) {
      console.log(new_schema_obj[key]);
      const kdb_type = convertFromTypeToKdb(new_schema_obj[key].type);
      const schem_str = `${key}:\`${kdb_type}$()`;
      schema_strings.push(schem_str);
    }
    const query = `trades:([]${schema_strings.join(';')})`;
    const result = await this._sendQuery(query);
    return result;
  }

  async updateTable(table_name, new_schema, cheetah) {
    // 1) get current table size and type schema
    const [
      current_schema_obj,
      table_size,
    ] = await this.getCurrentTableTypeSchema(table_name, cheetah);

    // 2) get union of columns
    const new_schema_obj = new_schema.schema;
    const new_schema_cols = Object.keys(new_schema_obj);
    const current_schema_cols = Object.keys(current_schema_obj);
    const columns_union = utils.union(
      new Set(new_schema_cols),
      new Set(current_schema_cols)
    );

    // 2) update the table
    for (let col of columns_union) {
      // same column different type
      if (
        new_schema_obj[col] &&
        current_schema_obj[col] &&
        new_schema_obj[col].type !== current_schema_obj[col].type
      ) {
        const newType = convertFromTypeToKdb(new_schema_obj[col].type);
        const result = await this._sendQuery(
          `${table_name}:update ${col}:\`${newType}$() from ${table_name}`
        );
        continue;
      }

      // new column
      if (new_schema_obj[col] && !current_schema_obj[col]) {
        const Type = new_schema_obj[col].type;
        if (table_size === 0) {
          const newType = convertFromTypeToKdb(new_schema_obj[col].type);
          const result = await this._sendQuery(
            `${table_name}:update ${col}:\`${newType}$() from ${table_name}`
          );
        } else {
          var value;
          if (new_schema_obj[col].default) {
            // use default
            value = Type.convert(new_schema_obj[col].default);
          } else {
            // use null value
            value = Type.nullValue;
          }
          const list = `(${Array(table_size).fill(value).join(';')})`;
          const result = await this._sendQuery(
            `${table_name}:update ${col}:${list} from ${table_name}`
          );
        }
        continue;
      }

      // delete column
      if (!new_schema_obj[col] && current_schema_obj[col]) {
        const result = await this._sendQuery(
          `${table_name}:delete ${col} from ${table_name}`
        );
        continue;
      }
    }
  }

  async getColumnsOrdered(table_name) {
    const cols = await this._sendQuery(`cols ${table_name}`);
    return cols;
  }

  async addRow(table_name, row) {
    // 1) get the current columns
    const cols = await this.getColumnsOrdered(table_name);

    // 2) get the associated values from row in order of cols
    const values = [];
    for (let col of cols) {
      values.push(row[col]);
    }

    // 3) construct the query
    const query = `\`${table_name} insert (${values.join(';')})`;

    // 4) get the result of the query
    const result = await this._sendQuery(query);

    return row;
  }

  async tableExists(table_name, cheetah) {
    const result = await this._sendQuery(`\`${table_name}~key \`${table_name}`);
    return !!result;
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
    if (!(await this.tableExists(table_name))) {
      throw new Error(`Table with name "${table_name}" does not exist.`);
    }

    const cols = await this.getColumnsOrdered(table_name);
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
