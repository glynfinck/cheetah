const Model = require('../../lib/model');
const cheetah = require('../../lib/cheetah');
const types = cheetah.types;
const assert = require('assert');

describe("Test Model class method 'compile'", function () {
  it('Test if compile adds a model to Cheetah instance.', async function () {
    await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const tradeSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
      price: { type: types.Real },
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const expected = new Model(name, tradeSchema, cheetah.connection);

    const valid =
      JSON.stringify(expected) === JSON.stringify(cheetah.models[name]);

    await cheetah.close();

    assert(valid);
  });
});

describe("Test Model class method 'create'", function () {
  it('Test the creation of a row for a model.', async function () {
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
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const newTrade = await Trade.create({
      date: new Date(),
      time: new Date(Date.now()),
      sym: 'GOOGL',
      price: 259.44,
      size: 50,
    });

    //console.log(newTrade);

    await cheetah.close();
  });
});
