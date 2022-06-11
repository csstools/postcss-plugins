import transformMediaList from './transform-media-list';
import mediaASTFromString from './media-ast-from-string';

// transform custom pseudo selectors with custom selectors
export default (atrule, customMedia, { preserve }) => {
	if (atrule.params.indexOf('--') > -1) {
		const mediaAST = mediaASTFromString(atrule.params);
		const params = String(transformMediaList(mediaAST, customMedia));
		if (params === null) {
			return;
		}

		if (params === atrule.params) {
			return;
		}

		atrule.cloneBefore({
			params: params,
		});

		if (!preserve) {
			atrule.remove();
		}
	}
};
