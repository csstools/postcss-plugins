import selectorParser from 'postcss-selector-parser';

export function adjustSelectorSpecificity(selector: string, amount: number): string {
	const selectorAST = selectorParser().astSync(selector);
	const adjustment = selectorParser().astSync(generateNot(amount));

	let didInsert = false;
	for (let i = 0; i < selectorAST.nodes[0].nodes.length; i++) {
		if (selectorAST.nodes[0].nodes[i].type === 'combinator' || selectorParser.isPseudoElement(selectorAST.nodes[0].nodes[i])) {
			selectorAST.nodes[0].insertBefore(selectorAST.nodes[0].nodes[i], adjustment);
			didInsert = true;
			break;
		}
	}

	if (!didInsert) {
		selectorAST.nodes[0].insertAfter(selectorAST.nodes[0].nodes[selectorAST.nodes[0].nodes.length - 1], adjustment);
	}

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
