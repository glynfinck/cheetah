const cheetah = require('../lib/cheetah');
const {
  DateKdb,
  TimeKdb,
  SymbolKdb,
  RealKdb,
  IntegerKdb,
  CharKdb,
} = cheetah.types;

// example: trades:([]date:`date$();time:`time$();sym:`symbol$();price:`real$();size:`int$(); cond:`char$())

const tradeSchema = new cheetah.Schema({
  date: {
    type: DateKdb,
  },
  time: {
    type: TimeKdb,
  },
  sym: {
    type: SymbolKdb,
  },
  price: {
    type: RealKdb,
  },
  size: {
    type: IntegerKdb,
  },
  cond: {
    type: CharKdb,
  },
});

const Trade = cheetah.table('Trade', tradeSchema);

module.exports = Trade;

// Trade.create({ sym: 'APPL', buy: 129.99 });

// Trade.find({ sym: 'APPL' });
