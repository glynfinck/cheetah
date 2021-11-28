const Bool = require('./schema/bool');
const Byte = require('./schema/byte');
const Short = require('./schema/short');
const Int = require('./schema/int');
const Long = require('./schema/long');
const Real = require('./schema/real');
const Float = require('./schema/float');
const Char = require('./schema/char');
const Symbol = require('./schema/symbol');
const Timestamp = require('./schema/timestamp');
const Month = require('./schema/month');
const KDate = require('./schema/kdate');
const DateTime = require('./schema/datetime');
const Timespan = require('./schema/timespan');
const Minute = require('./schema/minute');
const Second = require('./schema/second');
const Time = require('./schema/time');

// TODO: add support for nano-seconds, currently only milliseconds

exports.Bool = Bool;
exports.Byte = Byte;
exports.Short = Short;
exports.Int = Int;
exports.Long = Long;
exports.Real = Real;
exports.Float = Float;
exports.Char = Char;
exports.Symbol = Symbol;
exports.Timestamp = Timestamp;
exports.Month = Month;
exports.KDate = KDate;
exports.DateTime = DateTime;
exports.Timespan = Timespan;
exports.Minute = Minute;
exports.Second = Second;
exports.Time = Time;

const dictionary = {
  1: exports.Bool,
  4: exports.Byte,
  5: exports.Short,
  6: exports.Int,
  7: exports.Long,
  8: exports.Real,
  9: exports.Float,
  10: exports.Char,
  11: exports.Symbol,
  12: exports.Timestamp,
  13: exports.Month,
  14: exports.KDate,
  15: exports.DateTime,
  16: exports.Timespan,
  17: exports.Minute,
  18: exports.Second,
  19: exports.Time,
};

exports.typeList = Object.values(dictionary);

exports.convertFromNumType = function convertFromNumType(numType) {
  if (typeof numType !== 'number' || !Number.isInteger(numType)) {
    throw new Error(
      `The parameter numType must be an integer. The type \'${typeof numType}\' was given.`
    );
  }

  if (!dictionary[numType]) {
    throw new Error(`The numType \'${numType}\' does not exist!`);
  }

  return dictionary[numType];
};
