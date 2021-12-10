const Model = require('../../lib/model');
const cheetah = require('../../lib/cheetah');
const types = cheetah.types;
const assert = require('assert');
const Server = require('../connection-server/connection-server');

const HOST = '127.0.0.1';
const PORT = 5001;

const server = new Server('q', { host: HOST, port: PORT });

describe('Test Model static function `Model.validateName()`', function () {
  it('Test for a valid input name', function () {
    Model.validateName('Test');
    Model.validateName('Test1');
    Model.validateName('Test45345');
    Model.validateName('a1');
  });
});

describe('Test Model class method "model"', function () {
  before(async function () {
    await server.start();
  });
  it('Test if "compile" adds a model to Cheetah instance.', async function () {
    await cheetah.connect(HOST, PORT);

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

    await cheetah.model(name, tradeSchema);

    const expected = new Model(name, tradeSchema, cheetah.connection);

    const valid =
      JSON.stringify(expected) === JSON.stringify(cheetah.models[name]);

    await cheetah.close();

    assert(valid);
  });
  it('Test if "model" adds a table to Kdb database.', async function () {
    const conn = await cheetah.connect(HOST, PORT);

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

    const [firstTypeSchema, table_size] = await conn.getCurrentTableTypeSchema(
      table_name,
      cheetah
    );

    await cheetah.close();

    assert.deepEqual(firstSchema, new cheetah.Schema(firstTypeSchema));
  });
  it('Test if "model" updating the schema by adding a column to an empty table.', async function () {
    const conn = await cheetah.connect(HOST, PORT);

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
  it('Test if "model" updating the schema by removing a column from an empty table.', async function () {
    const conn = await cheetah.connect(HOST, PORT);

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
  it('Test if "model" updating the schema by changing the type of a column for an empty table.', async function () {
    const conn = await cheetah.connect(HOST, PORT);

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
      price: { type: types.Float },
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
  after(async function () {
    await server.stop();
  });
});

describe('Test Model class method "create"', function () {
  before(async function () {
    await server.start();
  });
  it('Test if "create" adds a row to the table using a model from a Cheetah instance.', async function () {
    await cheetah.connect(HOST, PORT);

    const name = 'Trade';
    const tradeSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      size: { type: types.Int },
      cond: { type: types.Char },
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const newTrade = await Trade.create({
      date: new Date(2020, 0, 1, 1, 1, 1, 1),
      time: new Date(2020, 0, 1, 1, 1, 1, 1),
      sym: 'APPL',
      price: 45.99,
      size: 50,
      cond: 'Y',
    });

    await cheetah.close();

    assert.deepEqual(
      [
        {
          date: '2020.01.01d',
          time: '01:01:01.001',
          sym: '`APPL',
          price: '45.99e',
          size: '50i',
          cond: '"Y"',
        },
      ],
      newTrade
    );
  });
  it('Test if "create" adds a list of one row to the table using a model from a Cheetah instance.', async function () {
    await cheetah.connect(HOST, PORT);

    const name = 'Trade';
    const tradeSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
      size: { type: types.Int },
      cond: { type: types.Char },
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const newTrade = await Trade.create([
      {
        date: new Date(2020, 0, 1, 1, 1, 1, 1),
        time: new Date(2020, 0, 1, 1, 1, 1, 1),
        sym: 'APPL',
        price: 45.99,
        size: 50,
        cond: 'Y',
      },
    ]);

    await cheetah.close();

    // check if the output is as expected
    assert.deepEqual(
      [
        {
          date: '2020.01.01d',
          time: '01:01:01.001',
          sym: '`APPL',
          price: '45.99e',
          size: '50i',
          cond: '"Y"',
        },
      ],
      newTrade
    );

    // check if a row was actually created in the Kdb+ database
    // TODO: create helper functions for testing this
  });
  after(async function () {
    await server.stop();
  });
});
