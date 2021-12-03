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

const utils = require('./utils');

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
  1: Bool,
  4: Byte,
  5: Short,
  6: Int,
  7: Long,
  8: Real,
  9: Float,
  10: Char,
  11: Symbol,
  12: Timestamp,
  13: Month,
  14: KDate,
  15: DateTime,
  16: Timespan,
  17: Minute,
  18: Second,
  19: Time,
};

exports.typeList = Object.values(dictionary);

exports.typeDict = {
  Bool: Bool,
  Byte: Byte,
  Short: Short,
  Int: Int,
  Long: Long,
  Real: Real,
  Float: Float,
  Char: Char,
  Symbol: Symbol,
  Timestamp: Timestamp,
  Month: Month,
  KDate: KDate,
  DateTime: DateTime,
  Timespan: Timespan,
  Minute: Minute,
  Second: Second,
  Time: Time,
};

// const typeKdbNameDict = {
//   Bool: 'bool',
//   Byte: 'byte',
//   Short: 'short',
//   Int: 'int',
//   Long: 'long',
//   Real: 'real',
//   Float: 'float',
//   Char: 'char',
//   Symbol: 'symbol',
//   Timestamp: 'timestamp',
//   Month: 'month',
//   KDate: 'date',
//   DateTime: 'datetime',
//   Timespan: 'timespan',
//   Minute: 'minute',
//   Second: 'second',
//   Time: 'time',
// };

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

// exports.convertFromTypeToKdb = function convertFromTypeToKdb(Type) {
//   // 1) check if Type is a class
//   if (!utils.isClass(Type)) {
//     throw new Error(
//       `The parameter "Type" must be a class constructor. A "${typeof Type}" was given.`
//     );
//   }

//   const name = Type.name;

//   if (Type !== exports.typeDict[name]) {
//     // 2) check if Type is a valid type
//     throw new Error(
//       `The parameter "Type" of class "${name}" is not a valid type. Must be one of thet types from cheetah.types.`
//     );
//   }

//   return typeKdbNameDict[name];
// };
