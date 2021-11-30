const KdbType = require('./kdb-type');
const utils = require('../utils');

class Float extends KdbType {
  static size = 4;
  static charType = 'f';
  static numType = 8;
  static nullValue = '0Ne';
  static kdbName = 'float';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}`;
  }
  static _valid(val) {
    utils.validateFloat(
      val,
      -1.797693e308,
      -2.225074e-308,
      2.225074e-308,
      1.797693e308,
      this.name
    );
  }
}

module.exports = exports = Float;
