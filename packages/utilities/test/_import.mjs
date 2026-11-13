import assert from 'node:assert';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof hasSupportsAtRuleAncestor === 'function');
