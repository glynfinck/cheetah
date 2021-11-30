const KdbType = require('./kdb-type');
const utils = require('../utils');

class Int extends KdbType {
  static size = 4;
  static charType = 'i';
  static numType = 6;
  static nullValue = '0Ni';
  static kdbName = 'int';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}i`;
  }
  static _valid(val) {
    utils.validateInteger(val, -2147483646, 2147483646, this.name);
  }
}

module.exports = exports = Int;
