'use strict';

const alphaSort = require('alpha-sort');
const arrayUniq = require('array-uniq');
const getTzIds = require('get-tz-ids');
const requireFromString = require('require-from-string');
const {rollup} = require('rollup');
const test = require('tape');

getTzIds().then(ids => {
  function runTest(description, main) {
    test(description, t => {
      t.plan(2);

      t.strictEqual(main.length, 10, 'should include 10 areas.');

      t.deepEqual(
        main,
        arrayUniq(ids.map(id => id.split('/')[0])).sort(alphaSort.asc),
        'should include all time zone areas.'
      );
    });
  }

  rollup({entry: require('./package.json')['jsnext:main']}).then(bundle => {
    runTest('require(\'tz-areas\')', require('.'));

    global.window = {};
    require('./' + require('./bower.json').main);

    runTest('window.tzAreas', global.window.tzAreas);

    runTest('Module exports', requireFromString(bundle.generate({format: 'cjs'}).code));
  });
});
