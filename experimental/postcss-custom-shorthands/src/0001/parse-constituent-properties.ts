import valueParser from 'postcss-value-parser';

export function parseConstituentProperties(value: string): Array<string> {
	const ast = valueParser(value);

	const properties = [];

	for (let i = 0; i < ast.nodes.length; i++) {
		if (ast.nodes[i].type === 'word') {
			properties.push(ast.nodes[i].value);
		}
	}

	return properties;
}
