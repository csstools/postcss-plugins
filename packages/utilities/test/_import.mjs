import assert from 'node:assert';
import { rewritePropertyNames, hasFallback, registeredPropertyNames } from '@csstools/utilities';

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof rewritePropertyNames === 'function');
assert.ok(typeof registeredPropertyNames === 'function');
