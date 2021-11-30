const KdbType = require('./kdb-type');
const utils = require('../utils');

class Second extends KdbType {
  static size = 4;
  static charType = 'v';
  static numType = 18;
  static nullValue = '0Nv';
  static kdbName = 'second';

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
}

module.exports = exports = Second;
