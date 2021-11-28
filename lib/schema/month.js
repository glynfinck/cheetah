const KdbType = require('./kdb-type');

class Month extends KdbType {
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
}

module.exports = exports = Month;
