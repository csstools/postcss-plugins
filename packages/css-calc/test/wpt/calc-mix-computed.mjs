import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

// Basic
assert.strictEqual(calc('calc-mix(1 100%)', { toCanonicalUnits: true }), '1');
assert.strictEqual(calc('calc-mix(1 50%, 3 50%)', { toCanonicalUnits: true }), '2');
assert.strictEqual(calc('calc-mix(1 25%, 3 25%, 5 50%)', { toCanonicalUnits: true }), '3.5');
assert.strictEqual(calc('calc-mix(1 25%, 3 25%, 7 0%, 5 50%)', { toCanonicalUnits: true }), '3.5');

// Missing weight percentages
assert.strictEqual(calc('calc-mix(1)', { toCanonicalUnits: true }), '1');
assert.strictEqual(calc('calc-mix(1 50%, 3)', { toCanonicalUnits: true }), '2');
assert.strictEqual(calc('calc-mix(1, 3, 5 50%)', { toCanonicalUnits: true }), '3.5');

// Weight percentages add up to more than 100%
assert.strictEqual(calc('calc-mix(1 75%, 3 75%)', { toCanonicalUnits: true }), '2');
assert.strictEqual(calc('calc-mix(1 50%, 3 50%, 5 50%)', { toCanonicalUnits: true }), '3');
assert.strictEqual(calc('calc-mix(1 75%, 3 75%, 5, 7)', { toCanonicalUnits: true }), '2');

// Weight percentages add up to less than 100%
assert.strictEqual(calc('calc-mix(1 25%, 3 25%)', { toCanonicalUnits: true }), '1');
assert.strictEqual(calc('calc-mix(1 25%, 3 25%, 5, 7)', { toCanonicalUnits: true }), '4');

// Weight percentages are all known zero
assert.strictEqual(calc('calc-mix(1 0%)', { toCanonicalUnits: true }), '0');
assert.strictEqual(calc('calc-mix(1 0%, 3 0%, 5 0%)', { toCanonicalUnits: true }), '0');
assert.strictEqual(calc('calc-mix(1px 0%)', { toCanonicalUnits: true }), '0px');
assert.strictEqual(calc('calc-mix(1px 0%, 3px 0%, 5px 0%)', { toCanonicalUnits: true }), '0px');
assert.strictEqual(calc('calc-mix(1% 0%)', { toCanonicalUnits: true }), '0%');
assert.strictEqual(calc('calc-mix(1% 0%, 3% 0%, 5% 0%)', { toCanonicalUnits: true }), '0%');

// Mixed dimensions/numbers/percentages
assert.strictEqual(calc('calc-mix(1% 0%, 3px 0%)', { toCanonicalUnits: true }), 'calc-mix(1% 0%, 3px 0%)');
assert.strictEqual(calc('calc-mix(1px 0%, 3% 0%)', { toCanonicalUnits: true }), 'calc-mix(1px 0%, 3% 0%)');

// sum percentage greater than 100%
assert.strictEqual(calc('calc-mix(1 50%, 3 100%)', { toCanonicalUnits: true }), '2.3333333333333');

// Weight percentage value greater than 100%
assert.strictEqual(calc('calc-mix(1 calc(150%), 3 100%)', { toCanonicalUnits: true }), '2');

// Weight percentage value less than 0%
assert.strictEqual(calc('calc-mix(1 calc(-50%), 3 100%)', { toCanonicalUnits: true }), '3');

// All values use dimension resolving (due to <length-percentage> property) percentages.
assert.strictEqual(calc('calc(10px + calc-mix(10% 50%, 30% 50%))', { toCanonicalUnits: true }), 'calc(10px + 20%)');

// Computed value time resolving units
assert.strictEqual(calc('calc-mix(10em 50%, 30px 50%)', { toCanonicalUnits: true }), 'calc-mix(10em 50%, 30px 50%)');

// Nested in other math functions
assert.strictEqual(calc('calc(sign(calc-mix(1 50%, 3 50%)) + 10)', { toCanonicalUnits: true }), '11');
assert.strictEqual(calc('calc(max(calc-mix(1 50%, 3 50%), 1))', { toCanonicalUnits: true }), '2');
