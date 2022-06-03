import assert from 'assert';
import { selectorSpecificity } from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

const selectorAST = parser().astSync('#foo:has(> .foo)');
const specificity = selectorSpecificity(selectorAST);

assert.equal(specificity.a, 1);
assert.equal(specificity.b, 1);
assert.equal(specificity.c, 0);
