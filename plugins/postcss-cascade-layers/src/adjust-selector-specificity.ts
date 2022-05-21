import selectorParser from 'postcss-selector-parser';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';

export function adjustSelectorSpecificity(selector: string, amount: number): string {
	const selectorAST = selectorParser().astSync(selector + generateNot(amount));

	selectorAST.walk((node) => {
		if ('nodes' in node) {
			sortCompoundSelectorsInsideComplexSelector(node);
		}
	});

	return selectorAST.toString();
}

function generateNot(specificity: number) {
	if (specificity === 0) {
		return '';
	}

	let list = '';
	for (let i = 0; i < specificity; i++) {
		list += ':not(#\\#)'; // something short but still very uncommon
	}

	return list;
}
