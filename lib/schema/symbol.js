const KdbType = require('./kdb-type');

class Symbol extends KdbType {
  static size = '*';
  static charType = 's';
  static numType = 11;
  static nullValue = '`';
  static kdbName = 'symbol';

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
}

module.exports = exports = Symbol;
