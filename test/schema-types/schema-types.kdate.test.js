const KDate = require('../../lib/schema/kdate');
const assert = require('assert');

describe('KDate class constructor test.', function () {
  it('Test January 1, 2011.', function () {
    assert.equal(new KDate(2011, 0, 1).getValue(), '2011.01.01d');
  });
  it('Test December 31, 2010.', function () {
    assert.equal(new KDate(2010, 11, 31).getValue(), '2010.12.31d');
  });
  it('Test March 15, 2021.', function () {
    assert.equal(new KDate(2021, 02, 15).getValue(), '2021.03.15d');
  });
});
