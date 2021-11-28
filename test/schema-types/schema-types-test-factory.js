const assert = require('assert');
const utils = require('../test-utils');
const Decimal = require('decimal.js');

exports.integerTypeIsValidTest = function (
  Type,
  max_negative,
  intermediate,
  max_positive
) {
  return function () {
    // correct input types
    // integer in valid_range should make isValid evaluate to true
    it(`isValid(${max_negative}) => true`, () => {
      assert.equal(Type.isValid(max_negative), true);
    });

    for (let value of intermediate) {
      it(`isValid(${value}) => true`, () => {
        assert.equal(Type.isValid(value), true);
      });
    }

    it(`isValid(0) => true`, () => {
      assert.equal(Type.isValid(0), true);
    });

    it(`isValid(${max_positive}) => true`, () => {
      assert.equal(Type.isValid(max_positive), true);
    });

    if (typeof max_negative === 'string') {
    }

    // out of range input types
    utils.testBelowMaxNegative(Type, max_negative, 1);
    utils.testBelowMaxNegative(Type, max_negative, 10000);
    utils.testAboveMaxPositive(Type, max_positive, 1);
    utils.testAboveMaxPositive(Type, max_positive, 10000);

    // non-integer input types
    it('isValid(3.141526) => false', () => {
      assert.equal(Type.isValid(3.141526), false);
    });

    it('isValid({}) => false', () => {
      assert.equal(Type.isValid({}), false);
    });

    it('isValid([]) => false', () => {
      assert.equal(Type.isValid([]), false);
    });

    it('isValid(true) => false', () => {
      assert.equal(Type.isValid(true), false);
    });

    it('isValid(new Date()) => false', () => {
      assert.equal(Type.isValid(new Date()), false);
    });

    // null input
    it('isValid(null) => true', () => {
      assert.equal(Type.isValid(null), true);
    });
  };
};

exports.integerTypeConvertTest = function (
  Type,
  delimeter,
  nullValue,
  max_negative,
  intermediate,
  max_positive
) {
  return function () {
    // correct input types
    // integer in valid_range should make isValid evaluate to true
    it(`convert(${max_negative}) => '${max_negative}${delimeter}'`, () => {
      assert.equal(Type.convert(max_negative), `${max_negative}${delimeter}`);
    });

    for (let value of intermediate) {
      it(`convert(${value}) => '${value}${delimeter}'`, () => {
        assert.equal(Type.convert(value), `${value}${delimeter}`);
      });
    }

    it(`convert(0) => true`, () => {
      assert.equal(Type.convert(0), `0${delimeter}`);
    });

    it(`isValid(${max_positive}) => '${max_positive}${delimeter}'`, () => {
      assert.equal(Type.convert(max_positive), `${max_positive}${delimeter}`);
    });

    // null input
    it(`convert(null) => '${nullValue}'`, () => {
      assert.equal(Type.convert(null), nullValue);
    });
  };
};

exports.realTypeIsValdTest = function (
  Type,
  max_negative,
  inter_negative,
  min_negative,
  min_positive,
  inter_positive,
  max_positive
) {
  return function () {
    // correct input types
    // real values with 7 digits (6 digits after decimal point) of accurracy in range:
    //  max_negative <= x <= min_negative ||
    //  x == 0 ||
    //  min_positive <= x <= max_positive
    // should make isValid evaluate to true
    it(`isValid(${max_negative}) => true`, () => {
      assert.equal(Type.isValid(max_negative), true);
    });

    for (let value of inter_negative) {
      it(`isValid(${value}) => true`, () => {
        assert.equal(Type.isValid(value), true);
      });
    }

    it(`isValid(${min_negative}) => true`, () => {
      assert.equal(Type.isValid(min_negative), true);
    });

    it(`isValid(0) => true`, () => {
      assert.equal(Type.isValid(0), true);
    });

    it(`isValid(${min_positive}) => true`, () => {
      assert.equal(Type.isValid(min_positive), true);
    });

    for (let value of inter_positive) {
      it(`isValid(${value}) => true`, () => {
        assert.equal(Type.isValid(value), true);
      });
    }

    it(`isValid(${max_positive}) => true`, () => {
      assert.equal(Type.isValid(max_positive), true);
    });

    // out of range input types

    const out_range_max_neg = utils.subOneToDecimalPlace(max_negative, 6);

    it(`isValid(${out_range_max_neg}) => false`, () => {
      assert.equal(Type.isValid(out_range_max_neg), false);
    });

    // it(`isValid(${max_negative - 1}) => false`, () => {
    //   assert.equal(Type.isValid(max_negative - 1), false);
    // });

    // it(`isValid(${min_negative * 0.1}) => false`, () => {
    //   assert.equal(Type.isValid(min_negative * 0.1), false);
    // });

    // it(`isValid(${min_positive * 0.1}) => false`, () => {
    //   assert.equal(Type.isValid(min_positive * 0.1), false);
    // });

    // it(`isValid(${max_positive + 1}) => false`, () => {
    //   assert.equal(Type.isValid(max_positive + 1), false);
    // });

    // it(`isValid(${max_positive + 10000}) => false`, () => {
    //   assert.equal(Type.isValid(max_positive + 10000), false);
    // });

    // // non-integer input types
    // it('isValid({}) => false', () => {
    //   assert.equal(Type.isValid({}), false);
    // });

    // it('isValid([]) => false', () => {
    //   assert.equal(Type.isValid([]), false);
    // });

    // it('isValid(true) => false', () => {
    //   assert.equal(Type.isValid(true), false);
    // });

    // it('isValid(new Date()) => false', () => {
    //   assert.equal(Type.isValid(new Date()), false);
    // });

    // // null input
    // it('isValid(null) => true', () => {
    //   assert.equal(Type.isValid(null), true);
    // });
  };
};

exports.realTypeConvertTest = function (
  Type,
  delimeter,
  nullValue,
  max_negative,
  inter_negative,
  min_negative,
  min_positive,
  inter_positive,
  max_positive
) {
  return function () {};
};
