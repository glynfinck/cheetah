const utils = require('./utils');

function Schema(schema) {
  this.schema = schema;
}

Schema._mergeSchemaObj = function (
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
        } else {
          throw new Error(
            `Must provide a default in the schema for model \'${name}\' for the column with name \'${column}\' if the table exists and is not empty. Either provied a default value to the schema for model \'${name}\' or remove rows from the table \'${table_name}\'.`
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
          `Tried to remove a column in the schema for table \'${name}\' and the table is not empty. To remove the column from a table first delete all data in the table with name \'${table_name}\'.`
        );
      }
    }
  }

  return merged_schema_obj;
};

Schema.mergeTypeSchema = function (
  name,
  table_name,
  current_table_size,
  current_type_schema_obj,
  new_schema
) {
  // 1) merge new table schema with current table schema
  const merged_schema_obj = Schema._mergeSchemaObj(
    name,
    table_name,
    current_table_size,
    current_type_schema_obj,
    new_schema.schema
  );

  return new Schema(merged_schema_obj);
};

/*!
 * Module exports.
 */
module.exports = Schema;
