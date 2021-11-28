const KdbType = require('./kdb-type');

class Timespan extends KdbType {
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
}

module.exports = exports = Timespan;
