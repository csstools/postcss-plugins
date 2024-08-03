import assert from 'node:assert';
import { isToken, NumberType, TokenType } from '@csstools/css-tokenizer';

assert.ok(isToken([TokenType.Number, (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]));
assert.ok(isToken(['number-token', (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]));
