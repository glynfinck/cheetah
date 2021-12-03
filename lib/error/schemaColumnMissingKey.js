const CheetahError = require('./cheetahError');

class SchemaColumnMissingKey extends CheetahError {
  constructor(columnName, missingKey) {
    const msg = `The column with name "${columnName}" must have a ${missingKey} key in it's Object.`;
    super(msg);
    this.name = 'SchemaColumnMissingKey';
  }
}

module.exports = exports = SchemaColumnMissingKey;
