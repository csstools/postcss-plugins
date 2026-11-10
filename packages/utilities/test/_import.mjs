import assert from 'node:assert';
import { expandPropertyRule, hasFallback, registeredPropertyNames } from '@csstools/utilities';

assert.ok(typeof hasFallback === 'function');
assert.ok(typeof expandPropertyRule === 'function');
assert.ok(typeof registeredPropertyNames === 'function');
