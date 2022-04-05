import valueParser from 'postcss-value-parser';

export function matcherForValue(value) {

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			delete node.sourceIndex;
			delete node.before;
			delete node.after;
			delete node.sourceEndIndex;

			if (node.type === 'space') {
				delete node.value;
			} else if (node.value.startsWith('$')) {
				delete node.value;
				node.isVariable = true;
			} else {
				try {
					node.dimension = valueParser.unit(node.value);
				} finally {
					if (node.dimension === false) {
						delete node.dimension;
					} else {
						delete node.dimension.number;
					}
				}
			}
		});

		if (ast.nodes.length === 1) {
			return ast.nodes[0];
		} else {
			return ast.nodes;
		}
	} catch (_) {
		/* ignore */
	}
}
