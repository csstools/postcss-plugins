import type { Node } from 'postcss-value-parser';

const keywords = [
	'at',
	'bottom',
	'center',
	'circle',
	'closest-corner',
	'closest-side',
	'ellipse',
	'farthest-corner',
	'farthest-side',
	'from',
	'in',
	'left',
	'right',
	'to',
	'top',
];

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
		let inPrefix = false;
		let hasColorInterpolationMethod = false;

		nodesLoop: for (let i = 0; i < node.nodes.length; i++) {
			const childNode = node.nodes[i];
			if (childNode.type === 'word' && keywords.includes(childNode.value)) {
				inPrefix = true;
			}

			if (childNode.type === 'div' && childNode.value.trim() === ',') {
				components = 0;
				inPrefix = false;
				continue;
			}

			if (childNode.type === 'word' && childNode.value === 'in') {
				hasColorInterpolationMethod = true;
				continue;
			}

			if (childNode.type === 'word' || childNode.type === 'function') {
				components++;
			}

			if (hasColorInterpolationMethod) {
				switch (node.value) {
					case 'conic-gradient':
						supportConditions.push('(background: conic-gradient(in oklch, red 0deg, red 0deg 1deg, red 2deg))');
						break nodesLoop;
					case 'linear-gradient':
						supportConditions.push('(background: linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))');
						break nodesLoop;
					case 'radial-gradient':
						supportConditions.push('(background: radial-gradient(in oklch, red, red 1px 2px, red 3px))');
						break nodesLoop;
					case 'repeating-conic-gradient':
						supportConditions.push('(background: repeating-conic-gradient(in oklch from 0deg, red 0deg, red 0deg 1deg, red 2deg))');
						break nodesLoop;
					case 'repeating-linear-gradient':
						supportConditions.push('(background: repeating-linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))');
						break nodesLoop;
					case 'repeating-radial-gradient':
						supportConditions.push('(background: repeating-radial-gradient(in oklch, red, red 1px 2px, red 3px))');
						break nodesLoop;
				}
			}

			if (!inPrefix && components === 3) {
				switch (node.value) {
					case 'conic-gradient':
						supportConditions.push('(background: conic-gradient(red 0deg, red 0deg 1deg, red 2deg))');
						break nodesLoop;
					case 'linear-gradient':
						supportConditions.push('(background: linear-gradient(red 0%, red 0% 1%, red 2%))');
						break nodesLoop;
					case 'radial-gradient':
						supportConditions.push('(background: radial-gradient(red, red 1px 2px, red 3px))');
						break nodesLoop;
					case 'repeating-conic-gradient':
						supportConditions.push('(background: repeating-conic-gradient(from 0deg, red 0deg, red 0deg 1deg, red 2deg))');
						break nodesLoop;
					case 'repeating-linear-gradient':
						supportConditions.push('(background: repeating-linear-gradient(red 0%, red 0% 1%, red 2%))');
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
