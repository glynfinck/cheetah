const KdbType = require('./kdb-type');
const utils = require('../utils');

class Short extends KdbType {
  static size = 2;
  static charType = 'h';
  static numType = 5;
  static nullValue = '0Nh';
  static kdbName = 'short';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}h`;
  }
  static _valid(val) {
    utils.validateInteger(val, -32767, 32767, this.name);
  }
}

module.exports = exports = Short;
