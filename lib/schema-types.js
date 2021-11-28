const utils = require('./utils');

class KdbType {
  static nullValue = null;

  constructor() {}

  static _valid(val) {}

  static _convert(val) {
    return val;
  }

  static valid(val) {
    try {
      if (val !== null) {
        this._valid(val);
      }
      return null;
    } catch (err) {
      return err;
    }
  }

  static convert(val) {
    // check if the value is valid
    const err = this.valid(val);
    if (err !== null) {
      throw err;
    }

    if (val !== null) {
      return this._convert(val);
    } else {
      return this.nullValue;
    }
  }

  static isValid(val) {
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

exports.Bool = class Bool extends (
  KdbType
) {
  static size = 1;
  static charType = 'b';
  static numType = 1;
  static nullValue = '0b';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val ? '1' : '0'}b`;
  }
  static _valid(val) {
    if (typeof val !== 'boolean') {
      throw new Error('The `val` parameter must be a boolean value.');
    }
  }
};

exports.Byte = class Byte extends (
  KdbType
) {
  static size = 1;
  static charType = 'x';
  static numType = 4;
  static nullValue = '0x00';

  constructor() {
    super();
  }

  static _convert(val) {
    const hexString = utils.extendDigits(val.toString(16), 2);
    return `0x${hexString}`;
  }
  static _valid(val) {
    utils.validateInteger(val, 0, 255, this.name);
  }
};

exports.Short = class Short extends (
  KdbType
) {
  static size = 2;
  static charType = 'h';
  static numType = 5;
  static nullValue = '0Nh';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}h`;
  }
  static _valid(val) {
    utils.validateInteger(val, -32767, 32767, this.name);
  }
};

exports.Int = class Int extends (
  KdbType
) {
  static size = 4;
  static charType = 'i';
  static numType = 6;
  static nullValue = '0Ni';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}i`;
  }
  static _valid(val) {
    utils.validateInteger(val, -2147483646, 2147483646, this.name);
  }
};

exports.Long = class Long extends (
  KdbType
) {
  static size = 8;
  static charType = 'j';
  static numType = 7;
  static nullValue = '0Nj';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}j`;
  }
  static _valid(val) {
    utils.validateInteger(
      val,
      '-9223372036854775806',
      '9223372036854775806',
      this.name
    );
  }
};

exports.Real = class Real extends (
  KdbType
) {
  static size = 4;
  static charType = 'e';
  static numType = 8;
  static nullValue = '0Ne';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}e`;
  }
  static _valid(val) {
    utils.validateFloat(
      val,
      -3.402823e38,
      -1.175495e-38,
      1.175495e-38,
      3.402823e38,
      this.name
    );
  }
};

exports.Float = class Float extends (
  KdbType
) {
  static size = 4;
  static charType = 'f';
  static numType = 8;
  static nullValue = '0Ne';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}`;
  }
  static _valid(val) {
    utils.validateFloat(
      val,
      -1.797693e308,
      -2.225074e-308,
      2.225074e-308,
      1.797693e308,
      this.name
    );
  }
};

exports.Char = class Char extends (
  KdbType
) {
  static size = 1;
  static charType = 'c';
  static numType = 10;
  static nullValue = ' ';

  constructor() {
    super();
  }
  static _convert(val) {
    return `\"${val}\"`;
  }
  static _valid(val) {
    if (typeof val !== 'string') {
      throw new Error('The `val` parameter must be a string.');
    }

    if (val.length != 1) {
      throw new Error('The `val` parameter must be one character long.');
    }
  }
};

exports.Symbol = class Symbol extends (
  KdbType
) {
  static size = '*';
  static charType = 's';
  static numType = 11;
  static nullValue = '`';

  constructor() {
    super();
  }
  static _convert(val) {
    return `\`${val}`;
  }
  static _valid(val) {
    if (typeof val !== 'string') {
      throw new Error('The `val` parameter must be a string.');
    }
  }
};

// TODO: add support for nano-seconds, currently only milliseconds

exports.Timestamp = class Timestamp extends (
  KdbType
) {
  static size = 8;
  static charType = 'p';
  static numType = 12;
  static nullValue = '0Np';

  constructor() {
    super();
  }
  static _convert(val) {
    const year = val.getFullYear().toString();
    const month = utils.extendDigits(val.getMonth() + 1, 2);
    const day = utils.extendDigits(val.getDay() + 1, 2);
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    const milliseconds = utils.extendDigits(val.getUTCMilliseconds(), 3);
    return `${year}.${month}.${day}T${hours}:${minutes}:${seconds}.${milliseconds}000000`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.Month = class Month extends (
  KdbType
) {
  static size = 8;
  static charType = 'z';
  static numType = 15;
  static nullValue = '0Nz';

  constructor() {
    super();
  }
  static _convert(val) {
    const year = val.getFullYear().toString();
    const month = utils.extendDigits(val.getMonth() + 1, 2);
    return `${year}.${month}m`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.KDate = class KDate extends (
  KdbType
) {
  static size = 4;
  static charType = 'd';
  static numType = 14;
  static nullValue = '0Nd';

  constructor() {
    super();
  }
  static _convert(val) {
    const year = val.getFullYear().toString();
    const month = utils.extendDigits(val.getMonth() + 1, 2);
    const day = utils.extendDigits(val.getDay() + 1, 2);
    return `${year}.${month}.${day}d`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.DateTime = class DateTime extends (
  KdbType
) {
  static size = 8;
  static charType = 'z';
  static numType = 15;
  static nullValue = '0Nz';

  constructor() {
    super();
  }
  static _convert(val) {
    const year = val.getFullYear().toString();
    const month = utils.extendDigits(val.getMonth() + 1, 2);
    const day = utils.extendDigits(val.getDay() + 1, 2);
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    return `${year}.${month}.${day}T${hours}:${minutes}:${seconds}`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.Timespan = class Timespan extends (
  KdbType
) {
  static size = 8;
  static charType = 'n';
  static numType = 16;
  static nullValue = '0Nn';

  constructor() {
    super();
  }
  static _convert(val) {
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    const milliseconds = utils.extendDigits(val.getUTCMilliseconds(), 3);
    return `${year}.${month}.${day}T${hours}:${minutes}:${seconds}.${milliseconds}000000`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.Minute = class Minute extends (
  KdbType
) {
  static size = 4;
  static charType = 'u';
  static numType = 17;
  static nullValue = '0Nu';

  constructor() {
    super();
  }
  static _convert(val) {
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    return `${hours}:${minutes}`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.Second = class Second extends (
  KdbType
) {
  static size = 4;
  static charType = 'v';
  static numType = 18;
  static nullValue = '0Nv';

  constructor() {
    super();
  }
  static _convert(val) {
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    return `${hours}:${minutes}:${seconds}`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

exports.Time = class Time extends (
  KdbType
) {
  static size = 4;
  static charType = 't';
  static numType = 19;
  static nullValue = '0Nt';

  constructor() {
    super();
  }
  static _convert(val) {
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    const milliseconds = utils.extendDigits(val.getUTCMilliseconds(), 3);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
};

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
