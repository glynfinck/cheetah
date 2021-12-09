const factory = require('../test-factory');
const cheetah = require('../../lib/cheetah');
const Connection = require('../../lib/connection');
const assert = require('assert');
const types = cheetah.types;
const Server = require('../connection-server/connection-server');

const HOST = '127.0.0.1';
const PORT = 5001;

const server = new Server('q', { host: HOST, port: PORT });

describe("Test Connection member class method 'connection'", function () {
  before(async function () {
    await server.start();
  });
  it("Test if calling 'connection' produces a connection with a valid readyState and WebSocket", async function () {
    // 1) open a connection
    const conn = await cheetah.connect(HOST, PORT);

    // 2) save valid
    const valid = conn.readyState === Connection.STATES.connected;

    // 3) close the connection
    await conn.close();

    assert(valid);
  });
  after(async function () {
    await server.stop();
  });
});
describe("Test Connection member class method 'getCurrentTableTypeSchema'", function () {
  before(async function () {
    await server.start();
  });
  it('Test getting the current type schema "trades" from the database', async function () {
    // 1) open a connection
    const conn = await cheetah.connect(HOST, PORT);

    // 2) construct inputs
    const table_name = 'trades';
    const inputs = [table_name, cheetah];

    // 3) construct expected
    const table_size = 0;
    const table_type_schema_obj = {
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      size: { type: types.Int },
      cond: { type: types.Char },
    };

    const Trade = await cheetah.model(
      'Trade',
      new cheetah.Schema(table_type_schema_obj)
    );

    const expected = [table_type_schema_obj, table_size];

    // 4) test async function
    await factory.testAsyncFunctionOutput(
      conn.getCurrentTableTypeSchema.bind(conn),
      inputs,
      expected
    );

    // 5) close the connection
    await conn.close();
  });
  after(async function () {
    await server.stop();
  });
});
