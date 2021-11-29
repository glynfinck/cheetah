const KdbType = require('./kdb-type');

class Char extends KdbType {
  static size = 1;
  static charType = 'c';
  static numType = 10;
  static nullValue = '" "';

  constructor(val) {
    super(val);
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
}

module.exports = exports = Char;
