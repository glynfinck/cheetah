const KdbType = require('./kdb-type');

class KDate extends KdbType {
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
}

module.exports = exports = KDate;
