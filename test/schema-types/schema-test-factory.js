const cheetah = require('../../lib/cheetah');
const assert = require('assert');
const Schema = cheetah.Schema;

exports.testMergSchemaObj = function (
  type_schema_obj,
  new_schema_obj,
  expected
) {
  return function () {
    const merged_schema_obj = Schema._mergeSchemaObj(
      'Trade',
      'trades',
      0,
      type_schema_obj,
      new_schema_obj
    );

    const expected_cols = Object.keys(expected);
    const merged_cols = Object.keys(merged_schema_obj);

    const columns_union = new Set([...expected_cols, ...merged_cols]);

    assert(
      columns_union.size === expected_cols.length &&
        columns_union.size === merged_cols.length
    );

    for (let col of columns_union) {
      assert(typeof expected[col].type === typeof merged_schema_obj[col].type);
      for (let schem of Object.keys(expected[col])) {
        if (schem !== 'type') {
          assert(expected[col][schem] && merged_schema_obj[col][schem]);
          assert(expected[col][schem] === merged_schema_obj[col][schem]);
        }
      }
    }
  };
};
