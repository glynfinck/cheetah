const CheetahError = require('./cheetahError');

class SchemaColumnError extends CheetahError {
  constructor(columnName) {
    const msg = `The column with name \`${columnName}\` must be of type Object.`;
    super(msg);
    this.name = 'SchemaColumnError';
  }
}

module.exports = exports = SchemaColumnError;
