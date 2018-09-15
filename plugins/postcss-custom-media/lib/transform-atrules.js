import transformMediaList from './transform-media-list';
import mediaASTFromString from './media-ast-from-string';

// transform custom pseudo selectors with custom selectors
export default (root, customMedia, opts) => {
	root.walkAtRules(mediaAtRuleRegExp, atrule => {
		if (customPseudoRegExp.test(atrule.params)) {
			const mediaAST = mediaASTFromString(atrule.params);
			const params = String(transformMediaList(mediaAST, customMedia));

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
