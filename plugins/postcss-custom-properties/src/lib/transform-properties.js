import { parse } from 'postcss-values-parser';
import transformValueAST from './transform-value-ast';
import { isRuleIgnored } from './is-ignored';

// transform custom pseudo selectors with custom selectors
export default (root, customProperties, opts) => {
	// walk decls that can be transformed
	root.walkDecls(decl => {
		if (isTransformableDecl(decl) && !isRuleIgnored(decl)) {
			const originalValue = decl.value;
			const valueAST = parse(originalValue);
			const value = String(transformValueAST(valueAST, customProperties));

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
	});
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
