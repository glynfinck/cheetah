const KdbType = require('./kdb-type');
const utils = require('../utils');

class Minute extends KdbType {
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
}

module.exports = exports = Minute;
