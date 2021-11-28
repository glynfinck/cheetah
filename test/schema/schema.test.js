const factory = require('../test-factory');
const cheetah = require('../../lib/cheetah');
const Schema = require('../../lib/schema');
const types = cheetah.types;

describe("Test Schema static class method '_mergeSchemaObj'", function () {
  it('Test merge identical type_schema and new_schema_obj objects', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });
  it('Test merge identical type_schema and new_schema_obj with identical "type" keys but different other keys for each column', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol, default: 'APPL' },
      price: { type: types.Real },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol, default: 'APPL' },
      price: { type: types.Real },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });
  it('Test merge identical type_schema and new_schema_obj with identical "type" keys but different other keys for each column', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Real, required: true },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Real, required: true },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });
  it('Test merge with a type change in one of the schema parameters for a table that is empty.', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Float, required: true },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Float, required: true },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });
  it('Test merge with the addition of a new column for a table that is empty.', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Float, required: true },
      amount: { type: types.Int, required: true },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol, default: 'APPL', required: true },
      price: { type: types.Float, required: true },
      amount: { type: types.Int, required: true },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });

  it('Test merge with the removal of a column for a table that is empty.', function () {
    // choose inputs
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
      amount: { type: types.Int },
    };
    const new_schema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema_obj,
    ];

    // set expected output
    const expected = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };

    factory.testFunctionOutput(Schema._mergeSchemaObj, inputs, expected);
  });
  // TODO: correct error output testing
});
describe("Test Schema static class method 'mergeTypeSchema'", function () {
  it('Test merge with the removal of a column for a table that is empty.', function () {
    const name = 'Trade';
    const table_name = 'trades';
    const table_size = 0;
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema = new Schema({
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    });

    // construct input vector
    const inputs = [
      name,
      table_name,
      table_size,
      current_type_scema_obj,
      new_schema,
    ];

    // set expected output
    const expected = new Schema({
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    });

    factory.testFunctionOutput(Schema.mergeTypeSchema, inputs, expected);
  });
});
