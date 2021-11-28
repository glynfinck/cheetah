const cheetah = require('../lib/cheetah');
const { KDate, Time, Symbol, Real, Int, Char } = cheetah.types;

// example: trades:([]date:`date$();time:`time$();sym:`symbol$();price:`real$();size:`int$(); cond:`char$())

const tradeSchema = new cheetah.Schema({
  date: {
    type: KDate,
    required: true,
  },
  time: {
    type: Time,
    required: true,
  },
  sym: {
    type: Symbol,
    required: true,
  },
  price: {
    type: Real,
    required: true,
  },
  size: {
    type: Int,
    required: true,
  },
  cond: {
    type: Char,
    required: true,
  },
});

const Trade = cheetah.table('Trade', tradeSchema);

module.exports = Trade;

// Trade.create({ sym: 'APPL', buy: 129.99 });

// Trade.find({ sym: 'APPL' });
