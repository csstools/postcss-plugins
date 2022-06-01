import transformMediaList from './transform-media-list';
import mediaASTFromString from './media-ast-from-string';

// transform custom pseudo selectors with custom selectors
export default (atrule, { preserve }, { customMedia }) => {
	if (customPseudoRegExp.test(atrule.params)) {
		// prevent infinite loops when using 'preserve' option
		if (!atrule[visitedFlag]) {
			atrule[visitedFlag] = true;

			const mediaAST = mediaASTFromString(atrule.params);
			const params = String(transformMediaList(mediaAST, customMedia));

			if (preserve) {
				// keep an original copy
				const node = atrule.cloneAfter();
				node[visitedFlag] = true;
			}
			// replace the variable with the params from @custom-media rule
			// skip if the variable is undefined
			if (params != null) {
				atrule.params = params;
			}
		}
	}
};

const visitedFlag = Symbol('customMediaVisited');
const customPseudoRegExp = /\(--[A-z][\w-]*\)/;
