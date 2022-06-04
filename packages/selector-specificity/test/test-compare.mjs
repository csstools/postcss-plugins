import assert from 'assert';
import { compare } from '@csstools/selector-specificity';

assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 0, b: 0, c: 0 }), 0);

assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 0, b: 0, c: 1 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 0, b: 1, c: 0 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 1, b: 0, c: 0 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 1, b: 1, c: 0 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 1, b: 0, c: 1 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 0, b: 1, c: 1 }), -1);
assert.strictEqual(compare({ a: 0, b: 0, c: 0 }, { a: 1, b: 1, c: 1 }), -1);

assert.strictEqual(compare({ a: 0, b: 0, c: 1 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 0, b: 1, c: 0 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 1, b: 0, c: 0 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 1, b: 1, c: 0 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 1, b: 0, c: 1 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 0, b: 1, c: 1 }, { a: 0, b: 0, c: 0 }), 1);
assert.strictEqual(compare({ a: 1, b: 1, c: 1 }, { a: 0, b: 0, c: 0 }), 1);
