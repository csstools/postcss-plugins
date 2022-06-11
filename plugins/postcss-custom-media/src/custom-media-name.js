import valueParser from 'postcss-value-parser';

export function getCustomMediaNameReference(source) {
	if (!source) {
		return;
	}

	let paramsAst = null;
	try {
		paramsAst = valueParser(source);
	} catch (_) {
		return;
	}

	if (!paramsAst || !paramsAst.nodes || !paramsAst.nodes.length) {
		return;
	}

	if (paramsAst.nodes.length !== 1) {
		return;
	}

	while (paramsAst.nodes[0].type === 'function' && paramsAst.nodes[0].value === '') {
		paramsAst = paramsAst.nodes[0];
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

	return paramsAst.nodes[nameNodeIndex].value.trim();
}
