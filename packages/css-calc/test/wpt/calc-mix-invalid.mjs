import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

// Syntax checking
assert.strictEqual(calc('calc-mix()', { toCanonicalUnits: true }), 'calc-mix()');
assert.strictEqual(calc('calc-mix( )', { toCanonicalUnits: true }), 'calc-mix( )');
assert.strictEqual(calc('calc-mix(,)', { toCanonicalUnits: true }), 'calc-mix(,)');
assert.strictEqual(calc('calc-mix(1, )', { toCanonicalUnits: true }), 'calc-mix(1, )');
assert.strictEqual(calc('calc-mix(0,1,)', { toCanonicalUnits: true }), 'calc-mix(0,1,)');
assert.strictEqual(calc('calc-mix(0,, 0)', { toCanonicalUnits: true }), 'calc-mix(0,, 0)');
assert.strictEqual(calc('calc-mix(1 50, 3)', { toCanonicalUnits: true }), 'calc-mix(1 50, 3)');
assert.strictEqual(calc('calc-mix(1 150%, 3)', { toCanonicalUnits: true }), 'calc-mix(1 150%, 3)');
assert.strictEqual(calc('calc-mix(1 -50%, 3)', { toCanonicalUnits: true }), 'calc-mix(1 -50%, 3)');
