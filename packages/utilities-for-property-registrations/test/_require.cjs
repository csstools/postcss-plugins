const assert = require('assert');
const {
	rewriteCustomPropertyNames,
	hoistPropertyRegistrations,
} = require('@csstools/utilities-for-property-registrations');

assert.ok(typeof rewriteCustomPropertyNames === 'function');
assert.ok(typeof hoistPropertyRegistrations === 'function');
