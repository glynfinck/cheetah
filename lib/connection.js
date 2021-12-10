const WebSocketAsPromised = require('websocket-as-promised');
const WebSocket = require('ws');
const STATES = require('./connectionstate');
const { convertFromNumType } = require('./schema-types');
const utils = require('./utils');
const ParamTypeError = require('./error/paramTypeError');
const Model = require('./model');

class Connection {
  static STATES = STATES;
  /**
   * Connection constructor
   *
   * For practical reasons, a Connection equals a Db.
   *
   * @param {Cheetah} base a cheetah instance
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
      const Type = new_schema_obj[key].type;
      const kdb_type = Type.kdbName;
      const schem_str = `${key}:\`${kdb_type}$()`;
      schema_strings.push(schem_str);
    }
    const query = `${table_name}:([]${schema_strings.join(';')})`;
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
        const Type = new_schema_obj[col].type;
        const newType = Type.kdbName;
        const result = await this._sendQuery(
          `${table_name}:update ${col}:\`${newType}$() from ${table_name}`
        );
        continue;
      }

      // new column
      if (new_schema_obj[col] && !current_schema_obj[col]) {
        const Type = new_schema_obj[col].type;
        if (table_size === 0) {
          const Type = new_schema_obj[col].type;
          const newType = Type.kdbName;
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

  async variableExists(var_name) {
    const result = await this._sendQuery(`\`${var_name}~key \`${var_name}`);
    return !!result;
  }

  async getVariable(name) {
    // 1) check if name is a string
    if (typeof table_name !== 'string') {
      throw new ParamTypeError(
        'createVariable',
        'name',
        typeof table_name,
        'string',
        'Connection'
      );
    }

    // 2) check if name is valid
    if (!utils.isValidVariableName(name)) {
      throw new CheetahError(
        'Invalid parameter `name`. Must be alphanumeric and have a letter for the first character.'
      );
    }

    // 3) check if variable exists
    if (!(await this.variableExists(name))) {
      throw new CheetahError(`Variable with name \`${name}\` does not exist.`);
    }

    // 4) get variable value and numType
    const value = await this._sendQuery(`${name}`);
    const type = await this._sendQuery(`type ${name}`);

    return { value, type };
  }

  async createVariable(name, value) {
    // 1) check if name is a string
    if (typeof table_name !== 'string') {
      throw new ParamTypeError(
        'createVariable',
        'name',
        typeof table_name,
        'string',
        'Connection'
      );
    }

    // 2) check if name is valid
    if (!utils.isValidVariableName(name)) {
      throw new CheetahError(
        'Invalid parameter `name`. Must be alphanumeric and have a letter for the first character.'
      );
    }

    // 2) check if value is an instance of a valid schema type
    const className = value.constructor.name;
    if (!typeDict[className]) {
      throw new Error(
        `The parameter \`value\` must be an instance of a valid schema type.`
      );
    }

    // 3) create variable
    const qValue = value.getValue();
    const response = await this._sendQuery(`${name}:${qValue}`);

    // 4) return the created variable as an object
    const result = {};
    result[name] = value;
    return result;
  }

  async getVariableNumType(var_name) {
    const result = await this._sendQuery(`type ${var_name}`);
    return result;
  }

  async tableExists(table_name) {
    // 1) check if table_name is a string
    if (typeof table_name !== 'string') {
      throw new ParamTypeError(
        'tableExists',
        'table_name',
        typeof table_name,
        'string',
        'Connection'
      );
    }

    // 2) check if table_name is a valid variable name
    if (!utils.isValidVariableName(table_name)) {
      throw new CheetahError(
        'Invalid table name. Must be alphanumeric and have a letter for the first character.'
      );
    }

    // 3) check if there is a variable with name table_name
    if (!(await this.variableExists(table_name))) {
      return false;
    }

    // 4) check if the type of the variable is of type table (numType = 98)
    // FIXME: instead of hardcoding 98 maybe set a numType for table class
    if ((await this.getVariableNumType(table_name)) !== 98) {
      return false;
    }

    return true;
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
