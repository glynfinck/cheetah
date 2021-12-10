const KdbType = require('./kdb-type');
const KdbTypeCastError = require('../error/kdbTypeCastError');

class Bool extends KdbType {
  static size = 1;
  static charType = 'b';
  static numType = 1;
  static nullValue = '0b';
  static kbdName = 'bool';

  constructor(value) {
    super(value);
  }
  convert(val) {
    return Bool.convert(val);
  }
  static _convert(val) {
    return `${val ? '1' : '0'}b`;
  }
  static _valid(val) {
    if (typeof val !== 'boolean') {
      throw new KdbTypeCastError(Bool, Boolean);
    }
  }
}

module.exports = exports = Bool;
