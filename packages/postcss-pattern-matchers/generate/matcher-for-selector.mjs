import selectorParser from 'postcss-selector-parser';

export function matcherForSelector(value) {

	try {
		const ast = selectorParser().astSync(value);
		ast.walk((node) => {
			node.toJSON = () => {
				let nodes = undefined;

				if (node.nodes) {
					nodes = node.nodes.map((node) => node.toJSON());
				}

				return {
					type: node.type,
					value: node.type === 'selector' || node.type === 'root' ? '' : node.toString(),
					nodes: nodes,
					isVariable: node.isVariable,
					isVariadic: node.isVariadic,
				};
			};

			if (node.value && node.value.startsWith('$$')) {
				node.isVariadic = true;
				node.isVariable = true;
				return;
			}

			if (node.value && node.value.startsWith('$')) {
				delete node.value;
				node.isVariable = true;
			}
		});

		if (ast.nodes.length === 1) {
			return JSON.parse(JSON.stringify(ast.nodes[0]));
		} else {
			return JSON.parse(JSON.stringify(ast.nodes));
		}
	} catch (e) {
		console.log(e);
		/* ignore */
	}
}
