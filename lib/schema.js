const utils = require('./utils');
const util = require('util');
const { typeDict } = require('./schema-types');

class Schema {
  /**
   * Schema constructor.
   *
   * @api public
   */
  constructor(schema) {
    Schema.isValidSchemaObj(schema);
    this.schema = schema;
  }

  static isValidSchemaObj(obj) {
    // 1) check if schema is an object
    if (!util.isObject(obj)) {
      throw new Error(
        'Invalid schemas object. Input "obj" must be of tyep object.'
      );
    }

    // 2) check that each value in the schema is an object
    const invalid_keys = [];
    for (let key of Object.keys(obj)) {
      if (!util.isObject(obj[key])) {
        throw new Error(
          `The column with name "${key}" must be of type Object.`
        );
      }
    }

    // 3) check that each value in the schema has a type key
    for (let key of Object.keys(obj)) {
      if (!obj[key].type) {
        throw new Error(
          `The column with name "${key}" must have a "type" key in it's Object.`
        );
      }
    }

    // 4) check that each type keys value is one of the valid types defined in cheetah.types
    for (let key of Object.keys(obj)) {
      if (!typeDict[obj[key].type.name]) {
        throw new Error(
          `The column with name "${key}" must have a "type" key with a Type from one of the valid types defined in cheetah.types.`
        );
      }
    }

    // 5) check that all other keys are in the whitelist
    const whitelist = new Set(['type', 'required', 'default']);

    for (let key of Object.keys(obj)) {
      const keys = Object.keys(obj[key]);
      const union = utils.union(keys, whitelist);
      if (union.size > whitelist.size) {
        throw new Error(
          `The column with name "${key}" must only have the following keys: [ "${[
            ...whitelist,
          ].join('", "')}" ]`
        );
      }
    }
  }

  /**
   * Compiles the schema and updates table with plural form of name parameter.
   *
   * @param {String} name the name for the model
   * @param {String} table_name the schema class for the model
   * @param {Number} connection the connection
   * @param {Object} connection the connection
   * @param {Object} cheetah the cheetah instance
   * @return {Object} the created model
   * @api private
   */
  static _validateSchemaUpdate(
    name,
    table_name,
    current_table_size,
    current_schema_obj,
    new_schema_obj
  ) {
    // 1) get the union of the current and new column names
    const new_columns = Object.keys(new_schema_obj);
    const current_columns = Object.keys(current_schema_obj);
    const columns_union = [...new Set([...current_columns, ...new_columns])];

    // 2) merge current table schema with new table schema
    const merged_schema_obj = {};
    for (let column of columns_union) {
      // CASES:

      //  !current &&  new  => rows.length() === 0 => default provided?
      //  user has attempted to create a new column for the table
      if (!current_schema_obj[column] && new_schema_obj[column]) {
        if (current_table_size === 0) {
          // Add new column to the model schema
          merged_schema_obj[column] = new_schema_obj[column];
        } else {
          if (new_schema_obj[column].default) {
            // Add new column to the model schema
            merged_schema_obj[column] = new_schema_obj[column];
          } else if (!new_schema_obj[column].required) {
            // Use the null value for the type
          } else {
            throw new Error(
              `Must provide a default in the schema for model \'${name}\' for the column with name \'${column}\' if the table exists, is not empty, and "required" is set to "true". Either provied a default value to the schema for model \'${name}\', remove rows from the table \'${table_name}\', or remove the "required" key in the schema.`
            );
          }
        }
      }

      //   current &&  new  => type same or rows.length() === 0
      //   user has attempted to change (or leave the same) an existing column in the table
      if (current_schema_obj[column] && new_schema_obj[column]) {
        if (current_table_size === 0) {
          merged_schema_obj[column] = new_schema_obj[column];
        } else {
          if (
            utils.isSameType(
              current_schema_obj[column].type,
              new_schema_obj[column].type
            )
          ) {
            merged_schema_obj[column] = new_schema_obj[column];
          } else {
            throw new Error(
              `A column's type was changed for the schema of model \'${name}\' and the corresponding table with name \'${table_name}\' is not empty. The column \'${column}\' has a current type of \'${current_schema_obj[column].type.name}\' and was tried to change to type \'${new_schema_obj[column].type.name}\'.`
            );
          }
        }
      }

      //   current && !new  => rows.length() === 0
      //   user has attempted to remove a column from the existing schema
      if (current_schema_obj[column] && !new_schema_obj[column]) {
        if (current_table_size === 0) {
        } else {
          throw new Error(
            `Tried to remove the column "${column}" in the schema for table \'${name}\' and the table is not empty. To remove the column from a table first delete all data in the table with name \'${table_name}\'.`
          );
        }
      }
    }
  }

  /**
   * Validates a schema update based on current type schema. Throws an error if the update is not valid.
   *
   * @param {String} name the name for the model
   * @param {String} table_name the name for the table
   * @param {Number} current_table_size the size of the table with table_name
   * @param {Object} current_type_schema_obj the current type schema object taken from the database
   * @param {Schema} new_schema the new Schema to update to
   * @return {Void}
   * @api public
   */
  static async validateSchemaUpdate(
    name,
    table_name,
    new_schema,
    connection,
    cheetah
  ) {
    // 1) get the current schema type object (a schema with only types defined ex: { date : { type : KDate } })
    //    and the size of the table
    const [
      current_type_schema_obj,
      current_table_size,
    ] = await connection.getCurrentTableTypeSchema(table_name, cheetah);

    // 2) validate the new table schema update from the current table schema
    Schema._validateSchemaUpdate(
      name,
      table_name,
      current_table_size,
      current_type_schema_obj,
      new_schema.schema
    );
  }
}

/*!
 * Module exports.
 */

module.exports = exports = Schema;
