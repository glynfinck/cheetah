const factory = require('../test-factory');
const cheetah = require('../../lib/cheetah');
const Connection = require('../../lib/connection');
const assert = require('assert');
const types = cheetah.types;
const Server = require('../connection-server/connection-server');

// const server = new Server(5002, 'js-websocket-requests.q');

// before(function () {
//   console.log('starting');
//   return server.start();
// });

// after(function () {
//   console.log('ending');
//   this.timeout(15000);
//   return server.stop();
// });

describe("Test Connection member class method 'connection'", function () {
  it("Test if calling 'connection' produces a connection with a valid readyState and WebSocket", async function () {
    // 1) open a connection
    const conn = await cheetah.connect('127.0.0.1', 5001);

    // 2) save valid
    const valid = conn.readyState === Connection.STATES.connected;

    // 3) close the connection
    await conn.close();

    assert(valid);
  });
});
describe("Test Connection member class method 'getCurrentTableTypeSchema'", function () {
  it('Test getting the current type schema "trades" from the database', async function () {
    // 1) open a connection
    const conn = await cheetah.connect('127.0.0.1', 5001);

    // 2) construct inputs
    const table_name = 'tradetests';
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

    const TradeTest = await cheetah.model(
      'TradeTest',
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
});
