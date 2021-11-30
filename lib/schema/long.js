const KdbType = require('./kdb-type');
const utils = require('../utils');

class Long extends KdbType {
  static size = 8;
  static charType = 'j';
  static numType = 7;
  static nullValue = '0Nj';
  static kdbName = 'long';
  

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}j`;
  }
  static _valid(val) {
    utils.validateInteger(
      val,
      '-9223372036854775806',
      '9223372036854775806',
      this.name
    );
  }
}

module.exports = exports = Long;
