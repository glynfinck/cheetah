const cheetah = require('./lib/cheetah');

cheetah.createConnection('127.0.0.1', 5001, (conn) => {
  console.log('Connected to Kdb+ Database!');
});
