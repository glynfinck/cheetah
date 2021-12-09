const factory = require('../test-factory');
const cheetah = require('../../lib/cheetah');
const Schema = require('../../lib/schema');
const types = cheetah.types;
const Server = require('../connection-server/connection-server');

const HOST = '127.0.0.1';
const PORT = 5001;

const server = new Server('q', { host: HOST, port: PORT });

describe("Test Schema static class method '_validateSchemaUpdate'", function () {
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

    Schema._validateSchemaUpdate(...inputs);
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

    Schema._validateSchemaUpdate(...inputs);
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

    Schema._validateSchemaUpdate(...inputs);
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

    Schema._validateSchemaUpdate(...inputs);
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

    Schema._validateSchemaUpdate(...inputs);
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

    Schema._validateSchemaUpdate(...inputs);
  });
  // TODO: correct error output testing
});
describe("Test Schema static class method 'validateSchemaUpdate'", function () {
  before(async function () {
    await server.start();
  });
  it('Test merge with the removal of a column for a table that is empty.', async function () {
    const conn = await cheetah.connect('127.0.0.1', 5001);
    const name = 'TestSchemaTrade';
    const table_name = 'testschematrades';
    const current_type_scema_obj = {
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    };
    const new_schema = new Schema({
      symbol: { type: types.Symbol },
      price: { type: types.Real },
    });

    const TestSchemaTrade = await cheetah.model(name, current_type_scema_obj);

    // construct input vector
    const inputs = [name, table_name, new_schema, conn, cheetah];

    const table_exists = await conn.tableExists(table_name, cheetah);

    if (table_exists) {
      await Schema.validateSchemaUpdate(...inputs);
    }

    cheetah.close();
  });
  after(async function () {
    await server.stop();
  });
});
