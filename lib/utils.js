const Decimal = require('decimal.js');

exports.replaceAll = function replaceAll(target, search, replacement) {
  return target.split(search).join(replacement);
};

exports.isSameType = function (A, B) {
  const a = new A();
  const b = new B();
  return a instanceof B && b instanceof A;
};

exports.extendDigits = function extendDigits(num, digits) {
  if (typeof num === 'number') {
    num = num.toString();
  }

  if (typeof num === 'string') {
    const zeros = digits - num.length;
    if (zeros > 0) {
      return new Array(zeros + 1).join('0') + num;
    } else {
      return num;
    }
  } else {
    throw new Error('Parameter `num` must be a string or number');
  }
};

exports.validateInteger = function validateInteger(val, min, max, className) {
  // convert inputs to Decimal types
  const min_decimal = new Decimal(min);
  const max_decimal = new Decimal(max);

  // check if input is a string or number
  if (typeof val !== 'number' && typeof val !== 'string') {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an integer value in the form of a javascript Number or String.'
    );
  }

  // convert val to to Decimal
  const val_decimal = new Decimal(val);

  // check if val is an integer
  if (!val_decimal.isInteger()) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an integer value in the form of a javascript Number or String.'
    );
  }

  // check if the value is between min and max (inclusive)
  if (val_decimal.lt(min_decimal) || val_decimal.gt(max_decimal)) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an integer value between ' +
        min_decimal +
        ' and ' +
        max_decimal +
        ' (inclusive).'
    );
  }
};

exports.validateFloat = function validateFloat(
  val,
  min_negative,
  max_negative,
  min_positive,
  max_positive,
  className
) {
  // check if the value is a number
  if (typeof val !== 'number') {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an number value.'
    );
  }

  // convert val to a Decimal
  const val_decimal = new Decimal(val);

  // check for number of digits of precision
  if (val_decimal.precision() > 7) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be a floating point value with 7-digits of precision (6 digits after the decimal point).'
    );
  }

  // check if the value is not 0 or is outside
  //   min_negative and max_negative (inclusive) or
  //   min_positive and max_positive (inclusive) or
  const isRangeNegative = val <= max_negative && val >= min_negative;
  const isRangePositive = val <= max_positive && val >= min_positive;
  const isZero = val === 0;
  const isOutside = !(isZero || isRangeNegative || isRangePositive);
  if (isOutside) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be a floating point value equal to 0 or between ' +
        min_negative +
        ' and ' +
        max_negative +
        ' (inclusive) or ' +
        min_positive +
        ' and ' +
        max_positive +
        ' (inclusive).'
    );
  }
};

exports.difference = function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
};

exports.union = function union(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
};

exports.isClass = function isClass(v) {
  if (typeof v !== 'function') {
    return false;
  }
  try {
    v();
    return false;
  } catch (error) {
    if (/^Class constructor/.test(error.message)) {
      return true;
    }
    return false;
  }
};
