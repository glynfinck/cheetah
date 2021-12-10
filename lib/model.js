const utils = require('./utils');
const Schema = require('./schema');
const CheetahError = require('./error/cheetahError');

class Model {
  /**
   * Model constructor.
   *
   * @api public
   */
  constructor(modelName, schema, connection) {
    this.schema = schema;
    this.modelName = modelName;
    this.connection = connection;
  }

  static validateName(modelName) {
    if (!utils.isValidVariableName(modelName)) {
      throw new CheetahError(
        'Invalid model name. Must be alphanumeric and have a letter for the first character.'
      );
    }
  }

  static pluralizeName(modelName) {
    return `${modelName.toLowerCase()}s`;
  }

  static async _createTable(table_name, new_schema, connection, cheetah) {
    // 1) create table
    await connection.createTable(table_name, new_schema, cheetah);
  }

  static async _updateTable(table_name, new_schema, connection, cheetah) {
    await connection.updateTable(table_name, new_schema, cheetah);
  }

  /**
   * Compiles the schema and updates table with plural form of name parameter.
   *
   *
   * @param {String} rows the name for the model
   * @param {Schema} schema the schema class for the model
   * @param {Connection} connection the connection
   * @param {Cheetah} cheetah the cheetah instance
   * @return {Promise<Model>} the created model
   * @api public
   */
  static async compile(name, new_schema, connection, cheetah) {
    // 1) check if name is valid
    Model.validateName(name);

    // 2) set the name of the model
    const table_name = Model.pluralizeName(name);

    // 3) check if table exists
    const table_exists = await connection.tableExists(table_name, cheetah);
    if (table_exists) {
      // validate the update for the table schema
      await Schema.validateSchemaUpdate(
        name,
        table_name,
        new_schema,
        connection,
        cheetah
      );

      // update the table
      await Model._updateTable(table_name, new_schema, connection, cheetah);
    } else {
      // create new table
      await Model._createTable(table_name, new_schema, connection, cheetah);
    }

    // 4) create new model with the new_schema
    const newModel = new Model(name, new_schema, connection);

    return newModel;
  }

  /**
   * Creates a new row(s) for this model.
   *
   * ####Example:
   *
   *     const tradeSchema = new cheetah.Schema({
   *       date : { type: KDate },
   *       time : { type: Time },
   *       sym : { type : Symbol }
   *     });
   *
   *     const Trade = cheetah.model('Trade', tradeSchema);
   *
   *     const newTrade = await Trade.create({
   *       date : Date.now(),
   *       time : Date.now(),
   *       sym : 'APPL'
   *     });
   *
   *
   * @param {(Object[]|Object)} rows the name for the model
   * @param {Schema} schema the schema class for the model
   * @return {Promise<Object>} the created row
   * @api public
   */
  async create(rows) {
    // 1) create rows
    const newRows = await this._create(rows);

    // 2) return the created rows
    return newRows;
  }

  _convertRow(row) {
    // 1) check if the row is an object
    if (typeof row !== 'object') {
      throw new Error(
        `The parameter "row" must be an object. A type of "${typeof row}" was given.`
      );
    }

    // 2) get the schema for the model
    const schem = this.schema.schema;

    // 3) get the columns from the schema
    const columns = Object.keys(schem);

    // 4) validate each colum
    const convertedRow = {};
    for (let col of columns) {
      // get the type
      const Type = schem[col].type;

      // check if the value was provied in row
      // if not use the default
      var kdbVal;
      if (!row[col]) {
        kdbVal = Type.convert(schem[col].default);
      } else {
        kdbVal = Type.convert(row[col]);
      }

      convertedRow[col] = kdbVal;
    }

    return convertedRow;
  }

  async _create(rows) {
    // 1) check if rows is undefined
    if (rows === undefined) {
      throw new Error('The required parameter `rows` is undefined.');
    }

    // 2) check if rows is either an object or list
    if (typeof rows !== 'object') {
      throw new Error('The parameter `rows` must be an object or an array.');
    }

    // 3) check if rows is an object and turn it into a list if so
    if (!Array.isArray(rows)) {
      rows = [rows];
    }

    // 4) go through each row and add it to the table
    const success_rows = [];
    for (let row of rows) {
      try {
        // convert the row
        const kdbRow = this._convertRow(row);

        // add row to table
        const table_name = Model.pluralizeName(this.modelName);
        const addedRow = await this.connection.addRow(table_name, kdbRow);

        // add row to success rows
        success_rows.push(addedRow);
      } catch (err) {
        console.log({ error: err, row: row });
      }
    }

    return success_rows;
  }

  // TODO: implement querying
  async find(obj) {}
}

module.exports = exports = Model;
