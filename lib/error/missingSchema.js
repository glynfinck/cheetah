const CheetahError = require('./cheetahError');

class MissingSchemaError extends CheetahError {
  /*!
   * MissingSchema Error constructor.
   * @param {String} name
   */
  constructor(name) {
    const msg =
      'Schema hasn\'t been registered for model "' +
      name +
      '".\n' +
      'Use cheetah.model(name, schema)';
    super(msg);
    this.name = 'MissingSchemaError';
  }
}

/*!
 * exports
 */

module.exports = MissingSchemaError;
