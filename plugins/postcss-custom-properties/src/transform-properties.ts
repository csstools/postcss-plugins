import type { Declaration } from 'postcss';
import valuesParser from 'postcss-value-parser';

import transformValueAST from './transform-value-ast';
import type { TransformValueASTBudget } from './transform-value-ast';
import { isDeclarationIgnored } from './is-ignored';

// transform custom pseudo selectors with custom selectors
export function transformProperties(decl: Declaration, customProperties: Map<string, valuesParser.ParsedValue>, opts: { preserve?: boolean, budget?: TransformValueASTBudget }): void {
	if (isTransformableDecl(decl) && !isDeclarationIgnored(decl)) {
		const originalValue = decl.raws?.value?.raw ?? decl.value;
		const valueAST = valuesParser(originalValue);
		const value = transformValueAST(valueAST, customProperties, opts.budget);

		if (value === originalValue) {
			return;
		}

		if (parentHasExactFallback(decl, value)) {
			if (!opts.preserve) {
				decl.remove();
			}

			return;
		}

		const clone = decl.cloneBefore({ value });

		if (clone.raws?.value?.raw) {
			clone.raws.value.raw = '';
		}

		if (!opts?.preserve) {
			decl.remove();
		}
	}
}

// match custom properties

// whether the declaration should be potentially transformed
const isTransformableDecl = (decl: Declaration): boolean => !decl.variable && decl.value.includes('--') && decl.value.toLowerCase().includes('var(');

function parentHasExactFallback(decl: Declaration, value: string): boolean {
	if (!decl || !decl.parent) {
		return false;
	}

	const prop = decl.prop.toLowerCase();

	// Walk backwards from the declaration instead of scanning from the start of
	// the container. `parent.index()` + a full sibling scan for every
	// declaration is O(n^2) for a rule with many declarations.
	let sibling = decl.prev();
	while (sibling) {
		if (sibling.type === 'decl' && sibling.prop.toLowerCase() === prop && sibling.value === value) {
			return true;
		}

		sibling = sibling.prev();
	}

	return false;
}
