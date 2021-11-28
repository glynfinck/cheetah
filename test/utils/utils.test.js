const assert = require('assert');
const cheetah = require('../../lib/cheetah');
const utils = require('../../lib/utils');
const types = cheetah.types;
const typeList = types.typeList;

describe("Test function 'isSameType' for JavaScript Types", function () {
  // true tests
  it('isSameType(Boolean, Boolean) => true', async function () {
    assert.equal(utils.isSameType(Boolean, Boolean), true);
  });

  it('isSameType(Number, Number) => true', async function () {
    assert.equal(utils.isSameType(Number, Number), true);
  });

  // false tests
  it('isSameType(Boolean, Number) => false', async function () {
    assert.equal(utils.isSameType(Boolean, Number), false);
  });
});

describe("Test function 'isSameType' for Custom Schema Types", function () {
  // true tests
  for (let i = 0; i < typeList.length; i++) {
    it(`isSameType(types.${typeList[i].name}, types.${typeList[i].name}) => true`, async function () {
      assert.equal(utils.isSameType(typeList[i], typeList[i]), true);
    });
  }

  // false tests
  for (let i = 0; i < typeList.length; i++) {
    for (let j = 0; j < typeList.length; j++) {
      if (i !== j) {
        it(`isSameType(types.${typeList[i].name}, types.${typeList[j].name}) => false`, async function () {
          assert.equal(utils.isSameType(typeList[i], typeList[j]), false);
        });
      }
    }
  }
});
