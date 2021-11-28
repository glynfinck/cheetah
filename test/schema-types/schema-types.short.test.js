const cheetah = require('../../lib/cheetah');
const factory = require('./schema-types-test-factory');
const Short = cheetah.types.Short;

/*
    cheetah.types.Short class type tests
*/

// Short static member tests

describe(
  'Short static member test: isValid',
  factory.integerTypeIsValidTest(Short, -32767, [-15000, 15000], 32767)
);

describe(
  'Short static member test: convert',
  factory.integerTypeConvertTest(
    Short,
    'h',
    '0Nh',
    -32767,
    [-15000, 15000],
    32767
  )
);
