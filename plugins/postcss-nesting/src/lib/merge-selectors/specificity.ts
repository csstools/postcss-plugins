import parser from 'postcss-selector-parser';
import { selectorSpecificity } from '@csstools/selector-specificity';

export function nodesAreEquallySpecific(nodes: Array<string>) {
	// Selector specificity is important when the parent selector is a list.
	// These cases should be resolved with `:is()` pseudo.
	// Since browser support for `:is()` is not great, we try to avoid it.
	// If the selector specificity is equal for all items in the selector list, we don't need `:is`.

	const specificities = nodes.map((node) => {
		return parser().astSync(node);
	}).map((ast) => {
		return selectorSpecificity(ast);
	});

	const first = specificities[0];
	for (let i = 1; i < specificities.length; i++) {
		if (first.a === specificities[i].a && first.b === specificities[i].b && first.c === specificities[i].c) {
			continue;
		}

		return false;
	}

	return true;
}
