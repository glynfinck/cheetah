const utils = require('./utils');
const Schema = require('./schema');

function Model() {
  this._connection = null;
  this._schema = null;
  this._newSchema = null;
  this._name = null;
}

Model.prototype.compile = function (name, new_schema, connection, cheetah) {
  // 1) set the name of the model
  this._name = name;
  this._table_name = `${name.toLowerCase()}s`;

  // 2) get the current schema type object (a schema with only types defined ex: { date : { type : KDate } })
  //    and the size of the table
  const [
    current_type_schema,
    current_table_size,
  ] = connection._getCurrentTableTypeSchema(this._table_name, cheetah);

  // 3) get merged schema between the new schema and old type schema
  const merged_schema = Schema.mergeTypeSchema(
    name,
    table_name,
    current_table_size,
    current_type_schema,
    new_schema.schema
  );

  // 4)  save new table schema to this model for update when a user inputs a new value
  this._newSchema = merged_schema;

  return this;
};

Model.prototype._updateSchema = async function () {
  // 1) check if the schema is out of date
  const curr_cols = Object.keys(this._schema);
  const new_cols = Object.keys(this._newSchema);
  const diff = utils.difference(new Set(curr_cols), new Set(new_cols));

  for (let col of diff) {
  }
};

Model.prototype.create = async function (rows) {
  // 1) check if there is a new schema and update table accordingly
  await this._updateSchema();

  // 2) create rows
  const newRows = await this._create(rows);

  return newRows;
};

Model.prototype._create = async function (rows) {
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
  for (row in rows) {
    try {
      // TODO: add functionality to add a row to the table
      console.log(row);
      success_rows.push(row);
    } catch (err) {
      console.log({ error: err, row: row });
    }
  }

  return success_rows;
};

Model.prototype.find = function find(obj) {};

/*!
 * Module exports.
 */
module.exports = Model;
