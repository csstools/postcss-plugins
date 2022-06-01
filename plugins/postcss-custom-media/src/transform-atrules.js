import transformMediaList from './transform-media-list';
import mediaASTFromString from './media-ast-from-string';

// transform custom pseudo selectors with custom selectors
export default (atrule, customMedia, { preserve }) => {
	if (customPseudoRegExp.test(atrule.params)) {
		// prevent infinite loops when using 'preserve' option
		if (!atrule[visitedFlag]) {
			atrule[visitedFlag] = true;

			const mediaAST = mediaASTFromString(atrule.params);
			const params = String(transformMediaList(mediaAST, customMedia));

			if (params === null) {
				return;
			}

			if (params === atrule.params) {
				return;
			}

			if (preserve) {
				// keep an original copy
				atrule.cloneBefore({
					params: params,
				});

				return;
			}

			atrule.params = params;
		}
	}
};

const visitedFlag = Symbol('customMediaVisited');
const customPseudoRegExp = /\(--[A-z][\w-]*\)/;
