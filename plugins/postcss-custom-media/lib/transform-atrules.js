import transformParamsByCustomParams from './transform-params-by-custom-params';
import mediaASTFromString from './media-ast-from-string';

// transform custom pseudo selectors with custom selectors
export default (root, customMedia, opts) => {
	root.walkAtRules(mediaAtRuleRegExp, atrule => {
		if (customPseudoRegExp.test(atrule.params)) {
			const mediaAST = mediaASTFromString(atrule.params);
			const params = transformParamsByCustomParams(mediaAST, customMedia, opts);

			if (opts.preserve) {
				atrule.cloneBefore({ params });
			} else {
				atrule.params = params;
			}
		}
	});
};

const mediaAtRuleRegExp = /^media$/i;
const customPseudoRegExp = /\(--[A-z][\w-]*\)/;
