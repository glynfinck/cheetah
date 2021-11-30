const KdbType = require('./kdb-type');

class Bool extends KdbType {
  static size = 1;
  static charType = 'b';
  static numType = 1;
  static nullValue = '0b';
  static kbdName = 'bool';

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
}

module.exports = exports = Bool;
