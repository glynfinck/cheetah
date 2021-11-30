const KdbType = require('./kdb-type');
const utils = require('../utils');

class Timestamp extends KdbType {
  static size = 8;
  static charType = 'p';
  static numType = 12;
  static nullValue = '0Np';
  static kdbName = 'timestamp';

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
}

module.exports = exports = Timestamp;
