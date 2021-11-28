const assert = require('assert');
var _ = require('lodash');

exports.testFunctionOutput = function (func, inputs, expected) {
  assert.deepEqual(func(...inputs), expected);
};

exports.testAsyncFunctionOutput = async function (func, inputs, expected) {
  const result = await func(...inputs);
  assert.deepEqual(result, expected);
};

exports.testFunctionError = function (func, inputs, expectedError) {
  assert.deepEqual(func(...inputs), expected);
};
