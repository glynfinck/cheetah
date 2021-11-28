const assert = require('assert');
const cheetah = require('../../lib/cheetah');
const Byte = cheetah.types.Byte;

/*
    cheetah.types.Byte class type tests
*/

describe('Byte static member test: isValid', () => {
  // correct input types
  it('isValid(0-255) => true', () => {
    for (let i = 0; i < 256; i++) {
      let hex = i.toString(16);
      if (hex.length === 1) {
        hex = `0${hex}`;
      }
      hex = `0x${hex}`;
      assert.equal(Byte.isValid(i), true);
    }
  });

  // incorrect input out of range
  it('isValid(256) => false', () => {
    assert.equal(Byte.isValid(256), false);
  });

  it('isValid(10000) => false', () => {
    assert.equal(Byte.isValid(10000), false);
  });

  it('isValid(-1) => false', () => {
    assert.equal(Byte.isValid(-1), false);
  });

  it('isValid(-10000) => false', () => {
    assert.equal(Byte.isValid(-10000), false);
  });

  // incorrect input types
  it('isValid(3.141526) => false', () => {
    assert.equal(Byte.isValid(3.141526), false);
  });

  it('isValid({}) => false', () => {
    assert.equal(Byte.isValid({}), false);
  });

  it('isValid([]) => false', () => {
    assert.equal(Byte.isValid([]), false);
  });

  it('isValid(true) => false', () => {
    assert.equal(Byte.isValid(true), false);
  });

  it('isValid(new Date()) => false', () => {
    assert.equal(Byte.isValid(new Date()), false);
  });

  // null input types
  it('isValid(null) => true', () => {
    assert.equal(Byte.isValid(null), true);
  });
});

describe('Byte static member test: convert', () => {
  // correct input types
  it('convert(0-255) => "0x00-0xff"', () => {
    for (let i = 0; i < 256; i++) {
      let hex = i.toString(16);
      if (hex.length === 1) {
        hex = `0${hex}`;
      }
      hex = `0x${hex}`;
      assert.equal(Byte.convert(i), hex);
    }
  });

  // null input types
  it('convert(null) => "0x00"', () => {
    assert.equal(Byte.convert(null), '0x00');
  });
});
