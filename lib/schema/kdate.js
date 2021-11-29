const KdbType = require('./kdb-type');
const utils = require('../utils');

class KDate extends KdbType {
  static size = 4;
  static charType = 'd';
  static numType = 14;
  static nullValue = '0Nd';

  constructor(year, month, day) {
    super();
    if (year === undefined) {
      this.value = KDate.nullValue;
    } else if (year instanceof Date) {
      this.value = this.convert(year);
    } else {
      if (year !== undefined && month !== undefined && day !== undefined) {
        if (
          typeof year === 'number' &&
          typeof month === 'number' &&
          typeof day === 'number'
        ) {
          // new Date(1776, 6, 4, 12, 30, 0, 0);

          this.value = KDate.convert(new Date(year, month, day));
        } else {
          throw new Error(
            `The constructor parameters year, month, and day must be of type Number for class "KDate".`
          );
        }
      } else {
        throw new Error(
          `Must provide a year, month, and day for "KDate" constructor`
        );
      }
    }
  }

  /**
   *
   * @param {Date} val
   * @returns {String}
   * @api private
   */
  static _convert(val) {
    const year = val.getFullYear().toString();
    const month = utils.extendDigits(val.getMonth() + 1, 2);
    const day = utils.extendDigits(val.getDate(), 2);
    return `${year}.${month}.${day}d`;
  }
  static _valid(val) {
    if (!(val instanceof Date)) {
      throw new Error('The `val` parameter must be a Date.');
    }
  }
}

module.exports = exports = KDate;
