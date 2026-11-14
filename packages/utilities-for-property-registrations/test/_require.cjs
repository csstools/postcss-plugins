const assert = require('assert');
const {
	rewritePropertyNames,
	hoistPropertyRegistrations,
} = require('@csstools/utilities-for-property-registrations');

assert.ok(typeof rewritePropertyNames === 'function');
assert.ok(typeof hoistPropertyRegistrations === 'function');
