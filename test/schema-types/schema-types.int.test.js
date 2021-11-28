const cheetah = require('../../lib/cheetah');
const factory = require('./schema-types-test-factory');
const Int = cheetah.types.Int;

/*
    cheetah.types.Int class type tests
*/

// Int static member tests

describe(
  'Int static member test: isValid',
  factory.integerTypeIsValidTest(
    Int,
    -2147483646,
    [-47483646, -10000, 10000, 47483646],
    2147483646
  )
);

describe(
  'Int static member test: convert',
  factory.integerTypeConvertTest(
    Int,
    'i',
    '0Ni',
    -2147483646,
    [-47483646, -10000, 10000, 47483646],
    2147483646
  )
);
