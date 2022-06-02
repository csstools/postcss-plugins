import mediaASTFromString from './media-ast-from-string';
import valueParser from 'postcss-value-parser';

// return custom selectors from the css root, conditionally removing them
export default (root, opts) => {
	// initialize custom selectors
	const customMedias = {};

	// for each custom selector atrule that is a child of the css root
	root.nodes.slice().forEach(node => {
		if (node.type !== 'atrule') {
			return;
		}

		if (node.name.toLowerCase() !== 'custom-media') {
			return;
		}

		let paramsAst = null;
		try {
			paramsAst = valueParser(node.params);
		} catch (_) {
			return;
		}

		if (!paramsAst || !paramsAst.nodes || !paramsAst.nodes.length) {
			return;
		}

		let nameNodeIndex = -1;
		for (let i = 0; i < paramsAst.nodes.length; i++) {
			const node = paramsAst.nodes[i];
			if (node.type === 'space' || node.type === 'comment') {
				continue;
			}

			if (node.type === 'word' && node.value.startsWith('--')) {
				nameNodeIndex = i;
				break;
			}

			return; /* invalid starting node */
		}

		if (nameNodeIndex < 0) {
			return;
		}

		const name = paramsAst.nodes[nameNodeIndex].value.trim();
		const selectors = valueParser.stringify(paramsAst.nodes.slice(nameNodeIndex + 1)).trim();

		// write the parsed selectors to the custom selector
		customMedias[name] = mediaASTFromString(selectors);

		// conditionally remove the custom selector atrule
		if (!Object(opts).preserve) {
			node.remove();
		}
	});

	return customMedias;
};
