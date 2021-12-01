const Model = require('../../lib/model');
const cheetah = require('../../lib/cheetah');
const types = cheetah.types;
const assert = require('assert');

describe('Test Model class method "compile"', function () {
  it('Test if "compile" adds a model to Cheetah instance.', async function () {
    // TODO: initialize a Kdb+/Q child process from JavaScript so that we can
    //       run our tests without having to boot up our kdb server seperately
    await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const tradeSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      size: { type: types.Int, default: 10 },
      cond: { type: types.Char, default: 'N' },
      example: { type: types.Char, default: 'Y' },
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const expected = new Model(name, tradeSchema, cheetah.connection);

    const valid =
      JSON.stringify(expected) === JSON.stringify(cheetah.models[name]);

    await cheetah.close();

    assert(valid);
  });
  it('Test if "compile" adds a table to Kdb database.', async function () {
    const conn = await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const table_name = Model.pluralizeName(name);
    const firstSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
    });

    const Trade = await cheetah.model(name, firstSchema);

    const [firstTypeSchema, table_size] = await conn.getCurrentTableTypeSchema(
      table_name,
      cheetah
    );

    await cheetah.close();

    assert.deepEqual(firstSchema, new cheetah.Schema(firstTypeSchema));
  });
  it('Test if "compile" updating the schema by adding a column to an empty table.', async function () {
    const conn = await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const table_name = Model.pluralizeName(name);
    const firstSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
    });

    await cheetah.model(name, firstSchema);

    const secondSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      cond: { type: types.Char },
    });

    await cheetah.model(name, secondSchema);

    const [secondTypeSchema, table_size] = await conn.getCurrentTableTypeSchema(
      table_name,
      cheetah
    );

    await cheetah.close();

    assert.deepEqual(secondSchema, new cheetah.Schema(secondTypeSchema));
  });
  it('Test if "compile" updating the schema by removing a column from an empty table.', async function () {
    const conn = await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const table_name = Model.pluralizeName(name);
    const firstSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      cond: { type: types.Char },
    });

    await cheetah.model(name, firstSchema);

    const secondSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
    });

    await cheetah.model(name, secondSchema);

    const [secondTypeSchema, table_size] = await conn.getCurrentTableTypeSchema(
      table_name,
      cheetah
    );

    await cheetah.close();

    assert.deepEqual(secondSchema, new cheetah.Schema(secondTypeSchema));
  });
});
