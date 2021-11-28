const cheetah = require('../../lib/cheetah');
const factory = require('./schema-types-test-factory');
const Real = cheetah.types.Real;

/*
    cheetah.types.Real class type tests
*/

// Real static member tests

describe(
  'Real static member test: isValid',
  factory.realTypeIsValdTest(
    Real,
    -3.402823e38,
    [],
    -1.175495e-38,
    1.175495e-38,
    [],
    3.402823e38
  )
);

describe(
  'Real static member test: convert',
  factory.realTypeConvertTest(
    Real,
    'e',
    '0Ne',
    -3.402823e38,
    [],
    -1.175495e-38,
    1.175495e-38,
    [],
    3.402823e38
  )
);
