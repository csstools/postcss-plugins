import valuesParser from 'postcss-value-parser';
import transformValueAST from './transform-value-ast';
import type { Declaration } from 'postcss';
import { isDeclarationIgnored } from './is-ignored';
import { HAS_VAR_FUNCTION_REGEX } from './is-var-function';

// transform custom pseudo selectors with custom selectors
export function transformProperties(decl: Declaration, customProperties: Map<string, valuesParser.ParsedValue>, localCustomProperties: Map<string, valuesParser.ParsedValue>, parsedValuesCache: Map<string, valuesParser.ParsedValue>, opts: { preserve?: boolean }) {
	if (isTransformableDecl(decl) && !isDeclarationIgnored(decl)) {
		const originalValue = decl.value;
		const valueAST = valuesParser(originalValue);
		let value = transformValueAST(valueAST, customProperties, localCustomProperties);

		// protect against circular references
		const valueSet = new Set();

		while (HAS_VAR_FUNCTION_REGEX.test(value) && !valueSet.has(value)) {
			valueSet.add(value);
			const parsedValueAST = valuesParser(value);
			value = transformValueAST(parsedValueAST, customProperties, localCustomProperties);
		}

		// conditionally transform values that have changed
		if (value !== originalValue) {
			if (parentHasExactFallback(decl, value)) {
				if (!opts.preserve) {
					decl.remove();
				}

				return;
			}

			if (opts.preserve) {
				const beforeDecl = decl.cloneBefore({ value });

				if (hasTrailingComment(beforeDecl) && beforeDecl.raws?.value) {
					beforeDecl.raws.value.value = beforeDecl.value.replace(TRAILING_COMMENT_REGEX, '$1');
					beforeDecl.raws.value.raw = beforeDecl.raws.value.value + beforeDecl.raws.value.raw.replace(TRAILING_COMMENT_REGEX, '$2');
				}
			} else {
				decl.value = value;

				if (hasTrailingComment(decl) && decl.raws?.value) {
					decl.raws.value.value = decl.value.replace(TRAILING_COMMENT_REGEX, '$1');
					decl.raws.value.raw = decl.raws.value.value + decl.raws.value.raw.replace(TRAILING_COMMENT_REGEX, '$2');
				}
			}
		}
	}
}

// match custom properties

// whether the declaration should be potentially transformed
const isTransformableDecl = (decl: Declaration) => !decl.variable && decl.value.includes('--') && decl.value.toLowerCase().includes('var(');

// whether the declaration has a trailing comment
const hasTrailingComment = (decl: Declaration) => 'value' in Object(Object(decl.raws).value) && ('raw' in (decl.raws?.value ?? {})) && TRAILING_COMMENT_REGEX.test(decl.raws.value?.raw ?? '');
const TRAILING_COMMENT_REGEX = /^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;

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
