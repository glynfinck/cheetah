exports.replaceAll = function replaceAll(target, search, replacement) {
  return target.split(search).join(replacement);
};

exports.extendDigits = function extendDigits(num, digits) {
  const num_str = num.toString();
  const zeros = digits - num_str.length;
  if (zeros > 0) {
    return new Array(zeros + 1).join('0') + num_str;
  } else {
    return num_str;
  }
};

exports.validateInteger = function validateInteger(val, min, max, className) {
  // check if the value is a number
  if (typeof val !== 'number' && val.isInteger()) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an integer value.'
    );
  }

  // check if the value is between min and max (inclusive)
  if (val < min || val > max) {
    throw new Error(
      'Could not convert to the type `' +
        className +
        '`. The `val` parameter must be an integer value between ' +
        min +
        ' and ' +
        max +
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

  // check for number of digits of precision
  const val_str = (1.0 * val).toString();
  const val_decimal_split = val_str.split('.');
  if (val_decimal_split.length > 1) {
    const val_exponential_split = val_decimal_split[1].split('e');
    if (val_exponential_split > 1) {
      if (val_exponential_split[0].length > 6) {
        throw new Error(
          'Could not convert to the type `' +
            className +
            '`. The `val` parameter must be a floating point value with 6-digits of precision after the decimal point.'
        );
      }
    } else {
      if (val_decimal_split[0].length > 6) {
        throw new Error(
          'Could not convert to the type `' +
            className +
            '`. The `val` parameter must be a floating point value with 6-digits of precision after the decimal point.'
        );
      }
    }
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
