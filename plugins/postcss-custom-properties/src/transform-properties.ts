import type { Declaration } from 'postcss';
import valuesParser from 'postcss-value-parser';

import transformValueAST from './transform-value-ast';
import { isDeclarationIgnored } from './is-ignored';

// transform custom pseudo selectors with custom selectors
export function transformProperties(decl: Declaration, customProperties: Map<string, valuesParser.ParsedValue>, opts: { preserve?: boolean }): void {
	if (isTransformableDecl(decl) && !isDeclarationIgnored(decl)) {
		const originalValue = decl.raws?.value?.raw ?? decl.value;
		const valueAST = valuesParser(originalValue);
		const value = transformValueAST(valueAST, customProperties);

		if (value === originalValue) {
			return;
		}

		if (parentHasExactFallback(decl, value)) {
			if (!opts.preserve) {
				decl.remove();
			}

			return;
		}

		decl.cloneBefore({ value });

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

	let hasFallback = false;
	const declIndex = decl.parent.index(decl);
	decl.parent.each((sibling, index) => {
		if (sibling === decl) {
			return false;
		}

		if (index >= declIndex) {
			return false;
		}

		if (sibling.type !== 'decl') {
			return;
		}

		if (sibling.prop.toLowerCase() === decl.prop.toLowerCase() && sibling.value === value) {
			hasFallback = true;
		}
	});

	return hasFallback;
}
