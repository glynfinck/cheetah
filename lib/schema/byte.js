const KdbType = require('./kdb-type');
const utils = require('../utils');

class Byte extends KdbType {
  static size = 1;
  static charType = 'x';
  static numType = 4;
  static nullValue = '0x00';
  static kbdName = 'byte';

  constructor(value) {
    super(value);
  }
  convert(val) {
    return Byte.convert(val);
  }
  static _convert(val) {
    const hexString = utils.extendDigits(val.toString(16), 2);
    return `0x${hexString}`;
  }
  static _valid(val) {
    utils.validateInteger(val, 0, 255, this.name);
  }
}

module.exports = exports = Byte;
