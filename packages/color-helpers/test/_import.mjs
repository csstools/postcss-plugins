import assert from 'assert';
import { calculations } from '@csstools/color-helpers';

const { deltaEOK } = calculations;

assert.equal(typeof deltaEOK, 'function', 'should export nested libraries');
assert.equal(typeof calculations.deltaEOK, 'function', 'should be possible to import from index');
