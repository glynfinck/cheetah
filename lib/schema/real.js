const KdbType = require('./kdb-type');
const utils = require('../utils');

class Real extends KdbType {
  static size = 4;
  static charType = 'e';
  static numType = 8;
  static nullValue = '0Ne';
  static kdbName = 'real';

  constructor() {
    super();
  }
  static _convert(val) {
    return `${val}e`;
  }
  static _valid(val) {
    utils.validateFloat(
      val,
      -3.402823e38,
      -1.175495e-38,
      1.175495e-38,
      3.402823e38,
      this.name
    );
  }
}

module.exports = exports = Real;
