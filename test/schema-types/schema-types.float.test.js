const cheetah = require('../../lib/cheetah');
const factory = require('./schema-types-test-factory');
const Float = cheetah.types.Float;

/*
    cheetah.types.Float class type tests
*/

// Float static member tests

describe(
  'Float static member test: isValid',
  factory.realTypeIsValdTest(
    Float,
    -1.797693e308,
    [],
    -2.225074e-308,
    2.225074e-308,
    [],
    1.797693e308
  )
);

describe(
  'Float static member test: convert',
  factory.realTypeConvertTest(
    Float,
    '',
    '0n',
    -1.797693e308,
    [],
    -2.225074e-308,
    2.225074e-308,
    [],
    1.797693e308
  )
);
