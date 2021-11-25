function Table() {
  this._connection = null;
  this._schema = null;
  this._newSchema = null;
}

Table.prototype._mergeSchemaObj = function (
  name,
  current_schema_obj,
  current_table,
  schema_obj
) {
  // 1) get the union of the current and new column names
  const columns = Object.keys(schema_obj);
  const current_columns = Object.keys(current_schema_obj);
  const columns_union = [...new Set([...current_columns, ...columns])];

  // 3) merge current schema/table with new schema/table
  const new_schema_obj = { ...current_schema_obj };
  for (column in columns_union) {
    // CASES:

    //  !current &&  new  => rows.length() === 0 => default provided?
    if (!current_schema_obj[column] && schema_obj[column]) {
      if (current_table.length === 0) {
        // Add new column to the table schema
        new_schema_obj[column] = schema_obj[column];
      } else {
        if (schema_obj[column].default) {
          // Add new column to the table schema
          new_schema_obj[column] = schema_obj[column];
        } else {
          throw new CheetahError(
            'Must provide a default value for a new column with name `' +
              column +
              '` if the table exists and has more than zero rows. Either provied a default value or remove rows from the table `' +
              name +
              '`.'
          );
        }
      }
    }

    //   current &&  new  => type same or rows.length() === 0
    if (current_schema_obj[column] && schema_obj[column]) {
      // TODO: implement this case
    }

    //   current && !new  => rows.length() === 0
    if (current_schema_obj[column] && !schema_obj[column]) {
      // TODO: implement this case
    }
  }

  return new_schema;
};

Table.prototype.compile = function (name, schema, connection, cheetah) {
  // 1) get the current table and schema
  const current_table = [];
  const current_schema_obj = {};

  // 2) merge new schema with current table/schema
  const schema_obj = schema.schema;
  const new_schema_obj = this._mergeSchemaObj(
    name,
    current_schema_obj,
    current_table,
    schema_obj
  );

  // 3) save new table schema to the database
  this._newSchema = new Schema(new_schema_obj);

  return this;
};

Table.prototype.create = function (rows) {
  // 1) check if there is a new schema and update table accordingly

  this._schema = this.newSchema;

  // 3) add new row table
};

Table.prototype._create = async function (rows) {
  // 1) check if rows is undefined
  if (rows === undefined) {
    throw new CheetahError('The required parameter `rows` is undefined.');
  }

  // 2) check if rows is either an object or list
  if (typeof rows !== 'object' && typeof rows !== 'list') {
    throw new CheetahError('The parameter `rows` must be an object or a list.');
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
      throw new CheetahError(err);
    }
  }

  return success_rows;
};

Table.prototype.find();

/*!
 * Module exports.
 */
module.exports = Table;
