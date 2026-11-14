import assert from 'node:assert';
import { parse, parseDashedFunctionArguments, parseFunctionParameters } from '@csstools/custom-function-parser';

parse('--foo(--bar)');

assert.ok(typeof parseDashedFunctionArguments === 'function');
assert.ok(typeof parseFunctionParameters === 'function');
