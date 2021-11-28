const assert = require('assert');
const Decimal = require('decimal.js');

function getDecimal(num, decimal) {
  const base = Math.log10(num);
  // console.log(base);
  const baseFloor = Math.floor(base);
  // console.log(baseFloor);
  // console.log(baseFloor - decimal);
  // console.log(Math.pow(10, baseFloor - decimal));
  return Math.pow(10, baseFloor - decimal);
}

exports.addOneToDecimalPlace = function (num, decimal) {
  if (decimal < 0 || !Number.isInteger(decimal))
    throw new Error('Parameter `decimal` must be a positive integer.');
  return num + getDecimal(num, decimal);
};

exports.subOneToDecimalPlace = function (num, decimal) {
  if (decimal < 0 || !Number.isInteger(decimal))
    throw new Error('Parameter `decimal` must be a positive integer.');
  return num - getDecimal(num, decimal);
};

exports.testBelowMaxNegative = function (Type, max_negative, amount) {
  // get the max_negative minus the amount
  const max_negative_sub_amount =
    typeof max_negative === 'string'
      ? new Decimal(max_negative).sub(amount).toString()
      : max_negative - amount;

  // change the test string based on if the input is a string or not
  var max_negative_sub_amount_str = max_negative_sub_amount.toString();
  max_negative_sub_amount_str =
    typeof max_negative_sub_amount === 'string'
      ? `\'${max_negative_sub_amount_str}\'`
      : max_negative_sub_amount_str;

  // run the test
  it(`isValid(${max_negative_sub_amount_str}) => false`, () => {
    assert.equal(Type.isValid(max_negative_sub_amount), false);
  });
};

exports.testAboveMaxPositive = function (Type, max_positive, amount) {
  // get the max_positive minus the amount
  const max_positive_add_amount =
    typeof max_positive === 'string'
      ? new Decimal(max_positive).add(amount).toString()
      : max_positive + amount;

  // change the test string based on if the input is a string or not
  var max_positive_add_amount_str = max_positive_add_amount.toString();
  max_positive_add_amount_str =
    typeof max_positive_add_amount === 'string'
      ? `\'${max_positive_add_amount_str}\'`
      : max_positive_add_amount_str;

  // run the test
  it(`isValid(${max_positive_add_amount_str}) => false`, () => {
    assert.equal(Type.isValid(max_positive_add_amount), false);
  });
};
