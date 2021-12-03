const CheetahError = require('./cheetahError');

class SchemaErrorValidation extends CheetahError {
  constructor(msg) {
    const msg = msg;
    super(msg);
    this.name = 'SchemaValidationError';
  }
}
