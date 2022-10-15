import valueParser from 'postcss-value-parser';

export function parseValuePresets(value: string): Map<string, Array<string>> {
	const ast = valueParser(value);

	const result: Map<string, Array<string>> = new Map();

	let name = '';
	let values = [];
	let lastIndex = 0;

	for (let i = 0; i < ast.nodes.length; i++) {
		const node = ast.nodes[i];

		if (node.type === 'space' || node.type === 'comment') {
			continue;
		}

		if (!name && node.type === 'word') {
			name = node.value;
			continue;
		}

		if (name && !values.length && node.type === 'div' && node.value === '/') {
			lastIndex = i + 1;
			continue;
		}

		if (node.type === 'div' && node.value === ',') {
			if (name && values.length) {
				result.set(name, values);
			}

			lastIndex = i + 1;
			name = '';
			values = [];
			continue;
		}

		const ratioIndexJump = indexJumpWhenRatio(ast.nodes, node);
		if (ratioIndexJump) {
			i += ratioIndexJump;
		}

		const nodeSlice = ast.nodes.slice(lastIndex, i + 1);
		values.push(valueParser.stringify(nodeSlice));
		lastIndex = i + 1;
	}

	if (name && values.length) {
		result.set(name, values);
	}

	return result;
}

export function parseValues(value: string): Array<string> {
	const ast = valueParser(value);

	const values = [];
	let lastIndex = 0;

	for (let i = 0; i < ast.nodes.length; i++) {
		const node = ast.nodes[i];

		if (node.type === 'space' || node.type === 'comment') {
			continue;
		}

		const ratioIndexJump = indexJumpWhenRatio(ast.nodes, node);
		if (ratioIndexJump) {
			i += ratioIndexJump;
		}

		const nodeSlice = ast.nodes.slice(lastIndex, i + 1);
		values.push(valueParser.stringify(nodeSlice));
		lastIndex = i + 1;
	}

	return values;
}

function indexJumpWhenRatio(nodes: Array<valueParser.Node>, node: valueParser.Node): number|false {
	if (node.type !== 'word') {
		return false;
	}

	if (!valueParser.unit(node.value)) {
		return false;
	}

	const meaningfulNodes = nodes.filter((x) => {
		return x.type !== 'space' && x.type !== 'comment';
	});

	const index = meaningfulNodes.indexOf(node);

	const slash = meaningfulNodes[index+1];
	const second = meaningfulNodes[index+2];

	if (slash.type !== 'div') {
		return false;
	}

	if (slash.value !== '/') {
		return false;
	}


	if (second.type !== 'word') {
		return false;
	}

	if (!valueParser.unit(second.value)) {
		return false;
	}

	return nodes.indexOf(second) - nodes.indexOf(node);
}
