const CheetahError = require('./cheetahError');

class SchemaColumnTypeError extends CheetahError {
  constructor(columnName, typeName) {
    const msg = `The column with name \`${columnName}\` must have a \`type\` key that is one of the valid types defined in \`cheetah.types\`. The type \`${typeName}\` was given.`;
    super(msg);
    this.name = 'SchemaColumnTypeError';
  }
}

module.exports = exports = SchemaColumnTypeError;
