const Model = require('../../lib/model');
const cheetah = require('../../lib/cheetah');
const types = cheetah.types;
const assert = require('assert');
const Server = require('../connection-server/connection-server');

const HOST = '127.0.0.1';
const PORT = 5001;

const server = new Server('q', { host: HOST, port: PORT });

describe('Test Error Handling for Model static function `Model.validateName()`', function () {
  const testFunc = function (name) {
    it(`Test for a invalid input name \`${name}\``, function () {
      var hasError = false;
      try {
        Model.validateName(name);
      } catch (err) {
        hasError = true;
        assert.equal(
          err.message,
          'Invalid model name. Must be alphanumeric and have a letter for the first character.'
        );
      }
      assert(hasError);
    });
  };
  testFunc('54');
  testFunc('1trades');
  testFunc('trades$');
  testFunc('trades2$');
});

describe('Test Error Handling for Model class method "compile"', function () {
  before(async function () {
    await server.start();
  });
  it('Test when a schema is used with an invalid schema', async function () {
    // TODO: initialize a Kdb+/Q child process from JavaScript so that we can
    //       run our tests without having to boot up our kdb server seperately
    await cheetah.connect('127.0.0.1', 5001);

    const name = 'Trade';
    const tradeSchema = 5;

    try {
      await cheetah.model(name, tradeSchema);
    } catch (err) {
      assert.equal(
        err.message,
        'The 2nd parameter to `cheetah.table()` should be a Schema or a valid JavaScript object which will be converted to a Schema.'
      );
    }

    await cheetah.close();
  });
  after(async function () {
    await server.stop();
  });
});
