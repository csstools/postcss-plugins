import valuesParser from 'postcss-value-parser';
import transformValueAST from './transform-value-ast';
import { isRuleIgnored } from './is-ignored';

// transform custom pseudo selectors with custom selectors
export default (decl, customProperties, opts) => {
	if (isTransformableDecl(decl) && !isRuleIgnored(decl)) {
		const originalValue = decl.value;
		const valueAST = valuesParser(originalValue);
		let value = transformValueAST(valueAST, customProperties);

		// protect against circular references
		const valueSet = new Set();

		while (customPropertiesRegExp.test(value) && !valueSet.has(value)) {
			valueSet.add(value);
			const parsedValueAST = valuesParser(value);
			value = transformValueAST(parsedValueAST, customProperties);
		}

		// conditionally transform values that have changed
		if (value !== originalValue) {
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
const customPropertyRegExp = /^--[A-z][\w-]*$/;

// match custom property inclusions
const customPropertiesRegExp = /(^|[^\w-])var\([\W\w]+\)/;

// whether the declaration should be potentially transformed
const isTransformableDecl = decl => !customPropertyRegExp.test(decl.prop) && customPropertiesRegExp.test(decl.value);

// whether the declaration has a trailing comment
const hasTrailingComment = decl => 'value' in Object(Object(decl.raws).value) && 'raw' in decl.raws.value && trailingCommentRegExp.test(decl.raws.value.raw);
const trailingCommentRegExp = /^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;
