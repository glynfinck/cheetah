const CheetahError = require('./cheetahError');

class ParamTypeError extends CheetahError {
  constructor(
    functionName,
    paramName,
    typeInput,
    correctType,
    className = undefined
  ) {
    var msg = `The function \`${functionName}\` requires that the parameter \`${paramName}\` has type \`${correctType}\` and \`${typeInput}\` was given.`;
    if (className) {
      msg = `The \`${className}\` class method \`${functionName}\` requires that the parameter \`${paramName}\` has type \`${correctType}\` and \`${typeInput}\` was given.`;
    }
    super(msg);
    this.name = 'ParamTypeError';
  }
}

module.exports = ParamTypeError;
