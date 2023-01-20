import valuesParser from 'postcss-value-parser';
import transformValueAST from './transform-value-ast';
import { Declaration } from 'postcss';
import { isDeclarationIgnored } from './is-ignored';

// transform custom pseudo selectors with custom selectors
export default (decl, customProperties, opts) => {
	if (isTransformableDecl(decl) && !isDeclarationIgnored(decl)) {
		const originalValue = decl.value;
		const valueAST = valuesParser(originalValue);
		let value = transformValueAST(valueAST, customProperties);

		// protect against circular references
		const valueSet = new Set();

		while (value.includes('--') && value.includes('var(') && !valueSet.has(value)) {
			valueSet.add(value);
			const parsedValueAST = valuesParser(value);
			value = transformValueAST(parsedValueAST, customProperties);
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

				if (hasTrailingComment(beforeDecl)) {
					beforeDecl.raws.value.value = beforeDecl.value.replace(trailingCommentRegExp, '$1');
					beforeDecl.raws.value.raw = beforeDecl.raws.value.value + beforeDecl.raws.value.raw.replace(trailingCommentRegExp, '$2');
				}
			} else {
				decl.value = value;

				if (hasTrailingComment(decl)) {
					decl.raws.value.value = decl.value.replace(trailingCommentRegExp, '$1');
					decl.raws.value.raw = decl.raws.value.value + decl.raws.value.raw.replace(trailingCommentRegExp, '$2');
				}
			}
		}
	}
};

// match custom properties

// whether the declaration should be potentially transformed
const isTransformableDecl = decl => !decl.variable && decl.value.includes('--') && decl.value.includes('var(');

// whether the declaration has a trailing comment
const hasTrailingComment = decl => 'value' in Object(Object(decl.raws).value) && 'raw' in decl.raws.value && trailingCommentRegExp.test(decl.raws.value.raw);
const trailingCommentRegExp = /^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;

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
