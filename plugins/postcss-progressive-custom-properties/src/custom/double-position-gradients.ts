import type { Node } from 'postcss-value-parser';

export function doublePositionGradients(node: Node): Array<string> {
	const supportConditions: Array<string> = [];

	// custom matchers :
	if (node.type === 'function' && (
		node.value === 'conic-gradient' ||
		node.value === 'linear-gradient' ||
		node.value === 'radial-gradient' ||
		node.value === 'repeating-conic-gradient' ||
		node.value === 'repeating-linear-gradient' ||
		node.value === 'repeating-radial-gradient'
	)) {
		let components = 0;
		let seenPrefix = false;

		nodesLoop: for (let i = 0; i < node.nodes.length; i++) {
			const childNode = node.nodes[i];
			if (childNode.type === 'div' && childNode.value.trim() === ',') {
				components = 0;
				seenPrefix = true;
				continue;
			}

			if (childNode.type === 'word' || childNode.type === 'function') {
				components++;
			}

			if (seenPrefix && components === 3) {
				switch (node.value) {
					case 'conic-gradient':
						supportConditions.push('(background: conic-gradient(red 0%, red 0deg 1%, red 2deg))');
						break nodesLoop;
					case 'linear-gradient':
						supportConditions.push('(background: linear-gradient(0deg, red 0% 1%, red 2%))');
						break nodesLoop;
					case 'radial-gradient':
						supportConditions.push('(background: radial-gradient(red, red 1px 2px, red 3px))');
						break nodesLoop;
					case 'repeating-conic-gradient':
						supportConditions.push('(background: repeating-conic-gradient(from 0deg, red 0deg, red 0deg 1deg, red 2deg))');
						break nodesLoop;
					case 'repeating-linear-gradient':
						supportConditions.push('(background: repeating-linear-gradient(0deg, red 0% 1%, red 2%))');
						break nodesLoop;
					case 'repeating-radial-gradient':
						supportConditions.push('(background: repeating-radial-gradient(red, red 1px 2px, red 3px))');
						break nodesLoop;
				}
			}
		}
	}

	return supportConditions;
}
