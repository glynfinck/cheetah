const KdbType = require('./kdb-type');

class Time extends KdbType {
  static size = 4;
  static charType = 't';
  static numType = 19;
  static nullValue = '0Nt';

  constructor() {
    super();
  }
  static _convert(val) {
    const hours = utils.extendDigits(val.getHours(), 2);
    const minutes = utils.extendDigits(val.getHours(), 2);
    const seconds = utils.extendDigits(val.getSeconds(), 2);
    const milliseconds = utils.extendDigits(val.getUTCMilliseconds(), 3);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
}

module.exports = exports = Time;
