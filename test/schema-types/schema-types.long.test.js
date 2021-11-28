const cheetah = require('../../lib/cheetah');
const factory = require('./schema-types-test-factory');
const Long = cheetah.types.Long;

/*
    cheetah.types.Long class type tests
*/

// Long static member tests

describe(
  'Long static member test: isValid',
  factory.integerTypeIsValidTest(
    Long,
    '-9223372036854775806',
    [-3372036854775806, -47483646, -10000, 10000, 47483646, 3372036854775806],
    '9223372036854775806'
  )
);

describe(
  'Long static member test: convert',
  factory.integerTypeConvertTest(
    Long,
    'j',
    '0Nj',
    '-9223372036854775806',
    [-3372036854775806, -47483646, -10000, 10000, 47483646, 3372036854775806],
    '9223372036854775806'
  )
);
