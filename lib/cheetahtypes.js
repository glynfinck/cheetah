const utils = require('./cheetahtypes-utils');

class KdbType {
  constructor() {
    this.nullValue = null;
  }
  _valid(val) {}
  _convert(val) {
    return val;
  }
  valid(val) {
    try {
      if (val !== null) {
        this._valid(val);
      }
      return null;
    } catch (err) {
      return new Error(err);
    }
  }
  convert(val) {
    // check if the value is valid
    const err = this.valid(val);
    if (err) {
      throw err;
    }

    if (val !== null) {
      return this._convert(val);
    } else {
      return this.nullValue;
    }
  }
  isValid(val) {
    try {
      if (val !== null) {
        this._valid(val);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}

exports.BooleanKdb = new (class BooleanKdb extends KdbType {
  constructor() {
    super();
    this.size = 1;
    this.charType = 'b';
    this.numType = 1;
    this.nullValue = '0b';
  }
  _convert(val) {
    return `${val ? '1' : '0'}b`;
  }
  _valid(val) {
    if (typeof val !== 'boolean') {
      throw new Error('The `val` parameter must be a boolean value.');
    }
  }
})();

exports.ByteKdb = new (class ByteKdb extends KdbType {
  constructor() {
    super();
    this.size = 1;
    this.charType = 'x';
    this.numType = 4;
    this.nullValue = '0x00';
  }

  _convert(val) {
    const hexString = val.toString(16);
    return `0x${hexString}`;
  }
  _valid(val) {
    if (typeof val !== 'number' && val.isInteger()) {
      throw new Error(
        'Could not convert to the type `' +
          this.constructor.name +
          '`. The `val` parameter must be an integer value.'
      );
    }

    if (val < 0 || val > 255) {
      throw new Error(
        'Could not convert to the type `' +
          this.constructor.name +
          '`. The `val` parameter must be an integer value between 0 and 255 (inclusive).'
      );
    }
  }
})();

exports.ShortKdb = new (class ShortKdb extends KdbType {
  constructor() {
    super();
    this.size = 2;
    this.charType = 'h';
    this.numType = 5;
    this.nullValue = '0Nh';
  }
  _convert(val) {
    return `${val}h`;
  }
  _valid(val) {
    utils.validateInteger(val, -32767, 32767, this.constructor.name);
  }
})();
exports.IntKdb = new (class IntKdb extends KdbType {
  constructor() {
    super();
    this.size = 4;
    this.charType = 'i';
    this.numType = 6;
    this.nullValue = '0Ni';
  }
  _convert(val) {
    return `${val}i`;
  }
  _valid(val) {
    utils.validateInteger(val, -2147483646, 2147483646, this.constructor.name);
  }
})();

exports.LongKdb = new (class LongKdb extends KdbType {
  constructor() {
    super();
    this.size = 8;
    this.charType = 'j';
    this.numType = 7;
    this.nullValue = '0Nj';
  }
  _convert(val) {
    return `${val}j`;
  }
  _valid(val) {
    utils.validateInteger(
      val,
      -9223372036854775806,
      9223372036854775806,
      this.constructor.name
    );
  }
})();

exports.RealKdb = new (class RealKdb extends KdbType {
  constructor() {
    super();
    this.size = 4;
    this.charType = 'e';
    this.numType = 8;
    this.nullValue = '0Ne';
  }
  _convert(val) {
    return `${val}e`;
  }
  _valid(val) {
    utils.validateFloat(
      val,
      -3.402823e38,
      -1.175495e-38,
      1.175495e-38,
      3.402823e38,
      this.constructor.name
    );
  }
})();

exports.FloatKdb = new (class FloatKdb extends KdbType {
  constructor() {
    super();
    this.size = 4;
    this.charType = 'f';
    this.numType = 8;
    this.nullValue = '0Ne';
  }
  _convert(val) {
    return `${val}`;
  }
  _valid(val) {
    utils.validateFloat(
      val,
      -1.797693e308,
      -2.225074e-308,
      2.225074e-308,
      1.797693e308,
      this.constructor.name
    );
  }
})();

exports.CharKdb = new (class CharKdb extends KdbType {
  constructor() {
    super();
    this.size = 1;
    this.charType = 'c';
    this.numType = 10;
    this.nullValue = ' ';
  }
  _convert(val) {
    return `\"${val}\"`;
  }
  _valid(val) {
    if (typeof val !== 'string') {
      throw new Error('The `val` parameter must be a string.');
    }

    if (val.length != 1) {
      throw new Error('The `val` parameter must be one character long.');
    }
  }
})();

exports.SymbolKdb = new (class SymbolKdb extends KdbType {
  constructor() {
    super();
    this.size = '*';
    this.charType = 's';
    this.numType = 11;
    this.nullValue = '`';
  }
  _convert(val) {
    return `\`${val}`;
  }
  _valid(val) {
    if (typeof val !== 'string') {
      throw new Error('The `val` parameter must be a string.');
    }
  }
})();

// TODO: add support for nano-seconds, currently only milliseconds
exports.TimestampKdb = new (class TimestampKdb extends KdbType {
  constructor() {
    super();
    this.size = '8';
    this.charType = 'p';
    this.numType = 12;
    this.nullValue = '0Np';
  }
  _convert(val) {
    var result = val.toISOString();
    result = utils.replaceAll(result, '-', '.');
    result = result.replace('Z', '000000');
    return result;
  }
  _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
})();

// TODO: all of the below validation classes
class MonthKdb {}
class DateKdb {}
class DateTimeKdb {}
class TimespanKdb {}
class MinuteKdb {}
class SecondKdb {}
class TimeKdb {}
