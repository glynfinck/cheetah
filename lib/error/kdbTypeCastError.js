const CheetahError = require('./cheetahError');

class KdbTypeCastError extends CheetahError {
  constructor(Type, validInputType) {
    const msg = `The input to the \`${Type.name}\` constructor must be of type \`${validInputType.name}\`.`;
    super(msg);
    this.name = 'KdbTypeCastError';
  }
}

module.exports = exports = KdbTypeCastError;
