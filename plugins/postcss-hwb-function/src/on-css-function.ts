import valueParser from 'postcss-value-parser';
import type { FunctionNode, Dimension, Node, DivNode, WordNode } from 'postcss-value-parser';
import { hwbToRgb } from './hwb';

export function onCSSFunctionSRgb(node: FunctionNode) {
	const rawNodes = node.nodes;
	const relevantNodes = rawNodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	const nodes = hwbFunctionContents(relevantNodes);
	if (!nodes) {
		return;
	}

	if (relevantNodes.length > 3 && (!nodes.slash || !nodes.alpha)) {
		return;
	}

	// rename the Color function to `rgb`
	node.value = 'rgb';

	transformAlpha(node, nodes.slash, nodes.alpha);

	/** Extracted Color channels. */
	const [channelNode1, channelNode2, channelNode3] = channelNodes(nodes);
	const [channelDimension1, channelDimension2, channelDimension3] = channelDimensions(nodes);

	/** RGB channels from the source color. */
	const channelNumbers: [number, number, number] = [
		channelDimension1.number,
		channelDimension2.number,
		channelDimension3.number,
	].map(
		channelNumber => parseFloat(channelNumber),
	) as [number, number, number];

	const rgbValues = hwbToRgb(
		channelNumbers,
	);

	node.nodes.splice(node.nodes.indexOf(channelNode1) + 1, 0, commaNode());
	node.nodes.splice(node.nodes.indexOf(channelNode2) + 1, 0, commaNode());

	replaceWith(node.nodes, channelNode1, {
		...channelNode1,
		value: String(rgbValues[0]),
	});

	replaceWith(node.nodes, channelNode2, {
		...channelNode2,
		value: String(rgbValues[1]),
	});

	replaceWith(node.nodes, channelNode3, {
		...channelNode3,
		value: String(rgbValues[2]),
	});
}

function commaNode(): DivNode {
	return {
		sourceIndex: 0,
		sourceEndIndex: 1,
		value: ',',
		type: 'div',
		before: '',
		after: '',
	};
}

function isNumericNode(node: Node): node is WordNode {
	if (!node || node.type !== 'word') {
		return false;
	}

	if (!canParseAsUnit(node)) {
		return false;
	}

	const unitAndValue = valueParser.unit(node.value);
	if (!unitAndValue) {
		return false;
	}

	return !!unitAndValue.number;
}

function isNumericNodeHueLike(node: Node): node is WordNode {
	if (!node || node.type !== 'word') {
		return false;
	}

	if (!canParseAsUnit(node)) {
		return false;
	}

	const unitAndValue = valueParser.unit(node.value);
	if (!unitAndValue) {
		return false;
	}

	const unit = unitAndValue.unit.toLowerCase();

	return !!unitAndValue.number && (
		unit === 'deg' ||
		unit === 'grad' ||
		unit === 'rad' ||
		unit === 'turn' ||
		unit === ''
	);
}

function isNumericNodePercentageOrNumber(node: Node): node is WordNode {
	if (!node || node.type !== 'word') {
		return false;
	}

	if (!canParseAsUnit(node)) {
		return false;
	}

	const unitAndValue = valueParser.unit(node.value);
	if (!unitAndValue) {
		return false;
	}

	return unitAndValue.unit === '%' || unitAndValue.unit === '';
}

function isCalcNode(node: Node): node is FunctionNode {
	return node && node.type === 'function' && node.value.toLowerCase() === 'calc';
}

function isVarNode(node: Node): node is FunctionNode {
	return node && node.type === 'function' && node.value.toLowerCase() === 'var';
}

function isSlashNode(node: Node): node is DivNode {
	return node && node.type === 'div' && node.value === '/';
}

type Hwb = {
	h: Dimension,
	hNode: Node,
	w: Dimension,
	wNode: Node,
	b: Dimension,
	bNode: Node,
	slash?: DivNode,
	alpha?: WordNode|FunctionNode,
}

function hwbFunctionContents(nodes): Hwb | null {
	if (!isNumericNodeHueLike(nodes[0])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[2])) {
		return null;
	}

	const out: Hwb = {
		h: valueParser.unit(nodes[0].value) as Dimension,
		hNode: nodes[0],
		w: valueParser.unit(nodes[1].value) as Dimension,
		wNode: nodes[1],
		b: valueParser.unit(nodes[2].value) as Dimension,
		bNode: nodes[2],
	};

	normalizeHueNode(out.h);
	if (out.h.unit !== '') {
		return null;
	}

	normalizeBlackOrWhiteNode(out.w);
	normalizeBlackOrWhiteNode(out.b);

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]) || isVarNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	return out;
}

function channelNodes(x: Hwb): [Node, Node, Node] {
	return [x.hNode, x.wNode, x.bNode];
}

function channelDimensions(x: Hwb): [Dimension, Dimension, Dimension] {
	return [x.h, x.w, x.b];
}

function transformAlpha(node: FunctionNode, slashNode: DivNode | undefined, alphaNode: WordNode | FunctionNode | undefined) {
	if (!slashNode || !alphaNode) {
		return;
	}

	node.value = 'rgba';
	slashNode.value = ',';
	slashNode.before = '';

	if (!isNumericNode(alphaNode)) {
		return;
	}

	const unitAndValue = valueParser.unit(alphaNode.value);
	if (!unitAndValue) {
		return;
	}

	if (unitAndValue.unit === '%') {
		// transform the Alpha channel from a Percentage to (0-1) Number
		unitAndValue.number = String(parseFloat(unitAndValue.number) / 100);
		alphaNode.value = String(unitAndValue.number);
	}
}

function replaceWith(nodes: Array<Node>, oldNode: Node, newNode: Node) {
	const index = nodes.indexOf(oldNode);
	nodes[index] = newNode;
}

function normalizeHueNode(dimension: Dimension) {
	switch (dimension.unit.toLowerCase()) {
		case 'deg':
			dimension.unit = '';
			return;
		case 'rad':
			// radians -> degrees
			dimension.unit = '';
			dimension.number = (parseFloat(dimension.number) * 180 / Math.PI).toString();
			return;

		case 'grad':
			// grades -> degrees
			dimension.unit = '';
			dimension.number = (parseFloat(dimension.number) * 0.9).toString();
			return;

		case 'turn':
			// turns -> degrees
			dimension.unit = '';
			dimension.number = (parseFloat(dimension.number) * 360).toString();
			return;
	}
}

function normalizeBlackOrWhiteNode(dimension: Dimension) {
	switch (dimension.unit) {
		case '%':
			return;
		default:
			dimension.unit = '%';
			dimension.number = (parseFloat(dimension.number) * 100).toString();
			return;
	}
}

function canParseAsUnit(node : Node): boolean {
	if (!node || !node.value) {
		return false;
	}

	try {
		return valueParser.unit(node.value) !== false;
	} catch (e) {
		return false;
	}
}
