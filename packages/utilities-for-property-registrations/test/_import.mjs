import assert from 'node:assert';
import { hoistPropertyRegistrations, rewriteCustomPropertyNames } from '@csstools/utilities-for-property-registrations';

assert.ok(typeof rewriteCustomPropertyNames === 'function');
assert.ok(typeof hoistPropertyRegistrations === 'function');
