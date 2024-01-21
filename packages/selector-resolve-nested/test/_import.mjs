import assert from 'assert';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

const a = parser().astSync('.foo &');
const b = parser().astSync('.bar');

assert.equal(resolveNestedSelector(a, b), '.foo .bar');
