import valueParser from 'postcss-value-parser';
import selectorParser from 'postcss-selector-parser';

export function isGuardedByAtSupportsFromAtRuleParams(atSupportsParams: string): boolean {
	if (!atSupportsParams.toLowerCase().includes(':has(')) {
		return false;
	}

	let isGuardedByAtSupports = false;

	try {
		const selectors: Set<string> = new Set();

		const ast = valueParser(atSupportsParams);
		ast.walk((node) => {
			if (node.type === 'function' && node.value.toLowerCase() === 'selector') {
				selectors.add(valueParser.stringify(node.nodes));
				return false;
			}
		});

		selectors.forEach((selector) => {
			if (selectorContainsHasPseudo(selector)) {
				isGuardedByAtSupports = true;
			}
		});

	} catch (e) {
		/* ignore */
	}

	return isGuardedByAtSupports;
}

function selectorContainsHasPseudo(selector: string): boolean {
	if (!selector.toLowerCase().includes(':has(')) {
		return false;
	}

	let containsHasPseudo = false;

	try {
		const ast = selectorParser().astSync(selector);
		ast.walk((node) => {
			if (node.type === 'pseudo' && node.value.toLowerCase() === ':has' && node.nodes && node.nodes.length > 0) {
				containsHasPseudo = true;
				return false;
			}
		});

	} catch (e) {
		/* ignore */
	}

	return containsHasPseudo;
}
