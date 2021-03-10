const surnameTester = require('../dist/main');

surnameTester([
  ['tanaka', 80],
  ['yamada', 20],
], {
  iter: 1000,
  seed: 0,
  selectivity: 0,
  testTimes: 1000,
});
