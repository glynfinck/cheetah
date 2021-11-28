const cheetah = require('./lib/cheetah');
const { KDate, Int, Short } = require('./lib/schema-types');

async function main() {
  // const conn = await cheetah.connect('127.0.0.1', 5001);

  // const tradeSchema = new cheetah.Schema({
  //   date: {
  //     type: KDate,
  //   },
  //   price: {
  //     type: Real,
  //   },
  // });

  console.log('inner');

  // const Trade = cheetah.table('Trade', tradeSchema);

  // const newTrade = await Trade.create({ date: Date.now(), price: 112.12 });

  // conosle.log(newTrade);
}

console.log('before');
main();
console.log('after');
