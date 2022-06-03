import assert from 'assert';
import { selectorSpecificity, compare } from '@csstools/selector-specificity';

assert.equal(selectorSpecificity().a, 0);
assert.equal(selectorSpecificity().b, 0);
assert.equal(selectorSpecificity().c, 0);

assert.equal(compare(selectorSpecificity(), selectorSpecificity()), 0);
