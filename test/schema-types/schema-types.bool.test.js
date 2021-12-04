const assert = require('assert');
const cheetah = require('../../lib/cheetah');
const Bool = cheetah.types.Bool;

/*
    cheetah.Bool class type tests
*/

describe('Bool static member test: isValid', () => {
  // correct input types
  it('isValid(true) => true', () => {
    assert.equal(Bool.isValid(true), true);
  });

  it('isValid(false) => true', () => {
    assert.equal(Bool.isValid(false), true);
  });

  // incorrect input types
  it('isValid("true") => false', () => {
    assert.equal(Bool.isValid('true'), false);
  });

  it('isValid("false") => false', () => {
    assert.equal(Bool.isValid('false'), false);
  });

  it('isValid(1) => false', () => {
    assert.equal(Bool.isValid(1), false);
  });

  it('isValid(0) => false', () => {
    assert.equal(Bool.isValid(0), false);
  });

  it('isValid(3.141526) => false', () => {
    assert.equal(Bool.isValid(3.141526), false);
  });

  it('isValid({}) => false', () => {
    assert.equal(Bool.isValid({}), false);
  });

  it('isValid([]) => false', () => {
    assert.equal(Bool.isValid([]), false);
  });

  // null input types
  it('isValid(null) => true', () => {
    assert.equal(Bool.isValid(null), true);
  });
});

// Bool static member tests
describe('Bool static member test: convert', () => {
  // correct input types
  it('convert(true) => "1b"', () => {
    assert.equal(Bool.convert(true), '1b');
  });

  it('convert(false) => "0b"', () => {
    assert.equal(Bool.convert(false), '0b');
  });

  // null input types
  it('convert(null) => "0b"', () => {
    assert.equal(Bool.convert(null), '0b');
  });
});

// Bool constructor tests
describe('Bool constructor test: convert', () => {
  // correct input types
  it('convert(true) => "1b"', () => {
    assert.equal(Bool.convert(true), '1b');
  });

  it('convert(false) => "0b"', () => {
    assert.equal(Bool.convert(false), '0b');
  });

  // null input types
  it('convert(null) => "0b"', () => {
    assert.equal(Bool.convert(null), '0b');
  });
});
