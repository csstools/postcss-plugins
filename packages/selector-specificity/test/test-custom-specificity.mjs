import assert from 'node:assert';
import { selectorSpecificity, specificityOfMostSpecificListItem } from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

function customCalc(n) {
	let specificity;

	if (n.type === 'pseudo' && n.value === ':foo') {
		specificity = {
			a: 2,
			b: 0,
			c: 0,
		};

		if (n.nodes) {
			const mostSpecific = specificityOfMostSpecificListItem(n.nodes, { customSpecificity: customCalc });
			specificity.a += mostSpecific.a;
			specificity.b += mostSpecific.b;
			specificity.c += mostSpecific.c;
		}

		return specificity;
	}

	if (n.type === 'pseudo' && n.value === ':bar') {
		specificity = {
			a: 0,
			b: 0,
			c: 0,
		};

		if (n.nodes) {
			const mostSpecific = specificityOfMostSpecificListItem(n.nodes, { customSpecificity: customCalc });
			specificity.a += mostSpecific.a;
			specificity.b += mostSpecific.b;
			specificity.c += mostSpecific.c;
		}

		return specificity;
	}
}

function calculate(selector) {
	const selectorAST = parser().astSync(selector);
	return selectorSpecificity(selectorAST, {
		customSpecificity: customCalc,
	});
}

assert.deepEqual(calculate(':foo'), { a: 2, b: 0, c: 0 });
assert.deepEqual(calculate(':foo(a)'), { a: 2, b: 0, c: 1 });

assert.deepEqual(calculate(':bar'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':bar(a)'), { a: 0, b: 0, c: 1 });
