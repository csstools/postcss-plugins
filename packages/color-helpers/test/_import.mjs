import assert from 'assert';
import { deltaEOK } from '@csstools/color-helpers/calculations';
import { calculations } from '@csstools/color-helpers';

assert.equal(typeof deltaEOK, 'function', 'should export nested libraries');
assert.equal(typeof calculations.deltaEOK, 'function', 'should be possible to import from index');
