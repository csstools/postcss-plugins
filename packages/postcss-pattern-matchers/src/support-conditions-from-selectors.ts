import valueParser from 'postcss-value-parser';
import selectorParser from 'postcss-selector-parser';

function maybeContainsSelector(value: string): boolean {
	return (
		value.indexOf(':any-link') !== -1 ||
		value.indexOf(':blank') !== -1 ||
		value.indexOf(':dir(') !== -1 ||
		value.indexOf(':focus-visible') !== -1 ||
		value.indexOf(':focus-within') !== -1 ||
		value.indexOf(':has(') !== -1 ||
		value.indexOf(':is(') !== -1 ||
		value.indexOf(':not(') !== -1
	);
}

export function supportConditionsForSelectorFromAtSupports(atSupportsParams: string): Array<string> {
	if (!maybeContainsSelector(atSupportsParams)) {
		return [];
	}

	const supportConditions: Set<string> = new Set();

	try {
		const selectors: Set<string> = new Set();

		const ast = valueParser(atSupportsParams);
		ast.walk((node) => {
			if (node.type === 'function' && node.value === 'selector') {
				selectors.add(valueParser.stringify(node.nodes));
				return false;
			}
		});

		selectors.forEach((selector) => {
			supportConditionsFromSelector(selector).forEach((condition) => {
				supportConditions.add(condition);
			});
		});

	} catch (e) {
		/* ignore */
	}

	return Array.from(new Set(supportConditions)); // list with unique items.
}

export function supportConditionsFromSelector(selector: string): Array<string> {
	if (!maybeContainsSelector(selector)) {
		return [];
	}

	const supportConditions: Set<string> = new Set();

	try {
		const ast = selectorParser().astSync(selector);
		ast.walk((node) => {
			if (node.type === 'pseudo' && node.value === ':any-link') {
				supportConditions.add('selector(:any-link)');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':blank') {
				supportConditions.add('selector(:blank)');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':dir') {
				supportConditions.add('selector(:dir(rtl))');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':focus-visible') {
				supportConditions.add('selector(:focus-visible)');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':focus-within') {
				supportConditions.add('selector(:focus-within)');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':has') {
				supportConditions.add('selector(a:has(b))');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':is') {
				supportConditions.add('selector(:is(a > b))');
				return;
			}

			if (node.type === 'pseudo' && node.value === ':not' && node.nodes && node.nodes.length > 1) {
				supportConditions.add('selector(:not(a, b))');
				return;
			}
		});

	} catch (e) {
		/* ignore */
	}

	return Array.from(supportConditions); // list with unique items.
}
