import assert from 'node:assert';
import { hoistPropertyRegistrations, rewritePropertyNames } from '@csstools/utilities-for-property-registrations';

assert.ok(typeof rewritePropertyNames === 'function');
assert.ok(typeof hoistPropertyRegistrations === 'function');
