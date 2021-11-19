import { parse } from 'postcss-values-parser';
import type { Func, Numeric, Operator } from 'postcss-values-parser';
import { labToSRgb, lchToSRgb } from './color';

function onCSSFunction(node: Func) {
	const name = node.name;
	const rawNodes = node.nodes;
	if (name !== 'lab' && name !== 'lch') {
		return;
	}

	let nodes: Lch | Lab | null = null;
	if (name === 'lab') {
		nodes = labFunctionContents(rawNodes);
	} else if (name === 'lch') {
		nodes = lchFunctionContents(rawNodes);
	}

	if (!nodes) {
		return;
	}

	if (rawNodes.length > 3 && (!nodes.slash || !nodes.alpha)) {
		return;
	}

	// rename the Color function to `rgb`
	node.name = 'rgb';

	transformAlpha(node, nodes.slash, nodes.alpha);

	/** Extracted Color channels. */
	const [channelNode1, channelNode2, channelNode3] = channelNodes(nodes);

	/** Corresponding Color transformer. */
	const toRGB = name === 'lab' ? labToSRgb : lchToSRgb;

	/** RGB channels from the source color. */
	const channelNumbers: [number, number, number] = [
		channelNode1.value,
		channelNode2.value,
		channelNode3.value,
	].map(
		channelNumber => parseFloat(channelNumber),
	) as [number, number, number];

	const rgbValues = toRGB(
		channelNumbers,
	).map(
		channelValue => Math.max(Math.min(Math.round(channelValue * 2.55), 255), 0),
	);

	channelNode3.replaceWith(
		channelNode3.clone({ value: String(rgbValues[2]) }),
	);

	channelNode2.replaceWith(
		channelNode2.clone({ value: String(rgbValues[1]) }),
		commaNode.clone(),
	);

	channelNode1.replaceWith(
		channelNode1.clone({ value: String(rgbValues[0]), unit: '' }),
		commaNode.clone(),
	);
}

export default onCSSFunction;

const commaNode = parse(',').first;

function isNumericNode(node): node is Numeric {
	return node && node.type === 'numeric';
}

function isNumericNodeNumber(node): node is Numeric {
	return node && node.type === 'numeric' && node.unit === '';
}

function isNumericNodeHueLike(node): node is Numeric {
	return node && node.type === 'numeric' && (
		node.unit === 'deg' ||
		node.unit === 'grad' ||
		node.unit === 'rad' ||
		node.unit === 'turn' ||
		node.unit === ''
	);
}

function isNumericNodePercentage(node): node is Numeric {
	return node && node.type === 'numeric' && node.unit === '%';
}

function isNumericNodePercentageOrNumber(node): node is Numeric {
	return node && node.type === 'numeric' && (node.unit === '' || node.unit === '%');
}

function isCalcNode(node): node is Func {
	return node && node.type === 'func' && node.name === 'calc';
}

function isVarNode(node): node is Func {
	return node && node.type === 'func' && node.name === 'var';
}

function isSlashNode(node): node is Operator {
	return node && node.type === 'operator' && node.value === '/';
}

type Lch = {
	l: Numeric,
	c: Numeric,
	h: Numeric,
	slash?: Operator,
	alpha?: Numeric|Func,
}

function lchFunctionContents(nodes): Lch|null {
	if (!isNumericNodePercentage(nodes[0])) {
		return null;
	}

	if (!isNumericNodeNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodeHueLike(nodes[2])) {
		return null;
	}

	const out: Lch = {
		l: nodes[0],
		c: nodes[1],
		h: nodes[2],
	};

	normalizeHueNode(out.h);
	if (out.h.unit !== '') {
		return null;
	}

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]) || isVarNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	return out;
}

type Lab = {
	l: Numeric,
	a: Numeric,
	b: Numeric,
	slash?: Operator,
	alpha?: Numeric | Func,
}

function labFunctionContents(nodes): Lab|null {
	if (!isNumericNodePercentage(nodes[0])) {
		return null;
	}

	if (!isNumericNodeNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodeNumber(nodes[2])) {
		return null;
	}

	const out: Lab = {
		l: nodes[0],
		a: nodes[1],
		b: nodes[2],
	};

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	return out;
}

function isLab(x: Lch | Lab): x is Lab {
	if (typeof (x as Lab).a !== 'undefined') {
		return true;
	}

	return false;
}

function channelNodes(x: Lch | Lab): [Numeric, Numeric, Numeric] {
	if (isLab(x)) {
		return [x.l, x.a, x.b];
	}

	return [x.l, x.c, x.h];
}

function transformAlpha(node: Func, slashNode: Operator | undefined, alphaNode: Numeric | Func | undefined) {
	if (!slashNode || !alphaNode) {
		return;
	}

	node.name = 'rgba';
	slashNode.replaceWith(commaNode.clone());

	if (!isNumericNode(alphaNode)) {
		return;
	}

	if (alphaNode.unit === '%') {
		// transform the Alpha channel from a Percentage to (0-1) Number
		alphaNode.value = String(parseFloat(alphaNode.value) / 100);
		alphaNode.unit = '';
	}
}

function normalizeHueNode(node: Numeric) {
	switch (node.unit) {
		case 'deg':
			node.unit = '';
			return;
		case 'rad':
			// radians -> degrees
			node.unit = '';
			node.value = (parseFloat(node.value) * 180 / Math.PI).toString();
			return;

		case 'grad':
			// grades -> degrees
			node.unit = '';
			node.value = (parseFloat(node.value) * 0.9).toString();
			return;

		case 'turn':
			// turns -> degrees
			node.unit = '';
			node.value = (parseFloat(node.value) * 360).toString();
			return;
	}
}
