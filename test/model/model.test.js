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
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const expected = new Model();
    expected._schema = tradeSchema;

    const valid =
      JSON.stringify(expected) === JSON.stringify(cheetah.models[name]);

    await cheetah.close();

    assert(valid);
  });
});

describe("Test Model class method 'create'", function () {
  it('Test the creation of a new model to a table.', async function () {
    await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const tradeSchema = new cheetah.Schema({
      date: {
        type: types.KDate,
      },
      time: { type: types.Time },
      sym: { type: types.Symbol },
    });

    const Trade = await cheetah.model(name, tradeSchema);

    const newTrade = await Trade.create({
      date: Date.now(),
      time: Date.now(),
      sym: 'APPL',
    });

    console.log(newTrade);

    await cheetah.close();
  });
});
