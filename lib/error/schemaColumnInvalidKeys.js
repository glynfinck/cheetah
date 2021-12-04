const CheetahError = require('./cheetahError');
const { stringListToString } = require('../utils');

class SchemaColumnInvalidKeys extends CheetahError {
  constructor(columnName, invalidKeys, whitelist) {
    const invalidKeysString = stringListToString(invalidKeys);
    const whitelistString = stringListToString(whitelist);
    const msg = `The column with name \`${columnName}\` must only have the following keys: ${whitelistString}. The following keys are not allowed: ${invalidKeysString}.`;
    super(msg);
    this.name = 'SchemaColumnInvalidKeys';
  }
}

module.exports = exports = SchemaColumnInvalidKeys;
