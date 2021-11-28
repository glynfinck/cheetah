const utils = require('./utils');
const Schema = require('./schema');

class Model {
  /**
   * Model constructor.
   *
   * @api public
   */
  constructor() {
    this._connection = null;
    this._schema = null;
    this._name = null;
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
    // 1) set the name of the model
    const table_name = `${name.toLowerCase()}s`;

    // 2) get the current schema type object (a schema with only types defined ex: { date : { type : KDate } })
    //    and the size of the table
    const [
      current_type_schema,
      current_table_size,
    ] = await connection.getCurrentTableTypeSchema(table_name, cheetah);

    // 3) get merged schema between the new schema and old type schema
    const merged_schema = Schema.mergeTypeSchema(
      name,
      table_name,
      current_table_size,
      current_type_schema,
      new_schema
    );

    // 4) update table in the database with the new schema

    // 5) create new model with the new_schema
    const newModel = new Model();
    newModel._schema = merged_schema;

    return newModel;
  }

  async _updateSchema() {
    // 1) check if the schema is out of date
    const curr_cols = Object.keys(this._schema);

    // for (let col of diff) {
    // }
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
    // 1) check if there is a new schema and update table accordingly
    await this._updateSchema();

    // 2) create rows
    const newRows = await this._create(rows);

    return newRows;
  }

  async _create(rows) {
    // 1) check if rows is undefined
    if (rows === undefined) {
      throw new Error('The required parameter `rows` is undefined.');
    }

    // 2) check if rows is either an object or list
    if (typeof rows !== 'object' && typeof rows !== 'list') {
      throw new Error('The parameter `rows` must be an object or a list.');
    }

    // 3) check if rows is an object and turn it into a list if so
    if (typeof rows === 'object') {
      rows = [rows];
    }

    // 4) go through each row and add it to the table
    const success_rows = [];
    for (let row of rows) {
      try {
        // TODO: add functionality to add a row to the table
        // console.log(row);
        success_rows.push(row);
      } catch (err) {
        console.log({ error: err, row: row });
      }
    }

    return success_rows;
  }

  async find(obj) {}
}

module.exports = exports = Model;
