import { parse } from './postcss-values-parser';
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
					decl.cloneBefore({ value });
				} else {
					decl.value = value;
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
