import valueParser from 'postcss-value-parser';
import type { FunctionNode, Dimension, Node, DivNode, WordNode, SpaceNode } from 'postcss-value-parser';
import { oklabToDisplayP3 } from './convert-oklab-to-display-p3';
import { oklchToDisplayP3 } from './convert-oklch-to-display-p3';
import { Declaration, Result } from 'postcss';
import { oklabToSRgb } from './convert-oklab-to-srgb';
import { oklchToSRgb } from './convert-oklch-to-srgb';

export function onCSSFunctionSRgb(node: FunctionNode) {
	const value = node.value.toLowerCase();
	const rawNodes = node.nodes;
	const relevantNodes = rawNodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	let nodes: Lch | Lab | null = null;
	if (value === 'oklab') {
		nodes = oklabFunctionContents(relevantNodes);
	} else if (value === 'oklch') {
		nodes = oklchFunctionContents(relevantNodes);
	}

	if (!nodes) {
		return;
	}

	// rename the Color function to `rgb`
	node.value = 'rgb';

	transformAlpha(node, nodes.slash, nodes.alpha);

	/** Extracted Color channels. */
	const [channelNode1, channelNode2, channelNode3] = channelNodes(nodes);
	const [channelDimension1, channelDimension2, channelDimension3] = channelDimensions(nodes);

	/** Corresponding Color transformer. */
	const toRGB = value === 'oklab' ? oklabToSRgb : oklchToSRgb;

	/** RGB channels from the source color. */
	const channelNumbers: [number, number, number] = [
		channelDimension1.number,
		channelDimension2.number,
		channelDimension3.number,
	].map(
		channelNumber => parseFloat(channelNumber),
	) as [number, number, number];

	const rgbValues = toRGB(
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

export function onCSSFunctionDisplayP3(node: FunctionNode, decl: Declaration, result: Result, preserve: boolean) {
	const originalForWarnings = valueParser.stringify(node);

	const value = node.value.toLowerCase();
	const rawNodes = node.nodes;
	const relevantNodes = rawNodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	let nodes: Lch | Lab | null = null;
	if (value === 'oklab') {
		nodes = oklabFunctionContents(relevantNodes);
	} else if (value === 'oklch') {
		nodes = oklchFunctionContents(relevantNodes);
	}

	if (!nodes) {
		return;
	}

	if (relevantNodes.length > 3 && (!nodes.slash || !nodes.alpha)) {
		return;
	}

	// rename the Color function to `color`
	node.value = 'color';

	/** Extracted Color channels. */
	const [channelNode1, channelNode2, channelNode3] = channelNodes(nodes);
	const [channelDimension1, channelDimension2, channelDimension3] = channelDimensions(nodes);

	/** Corresponding Color transformer. */
	const toDisplayP3 = value === 'oklab' ? oklabToDisplayP3 : oklchToDisplayP3;

	/** RGB channels from the source color. */
	const channelNumbers: [number, number, number] = [
		channelDimension1.number,
		channelDimension2.number,
		channelDimension3.number,
	].map(
		channelNumber => parseFloat(channelNumber),
	) as [number, number, number];

	const [rgbValues, inGamut] = toDisplayP3(
		channelNumbers,
	);

	if (!inGamut && preserve) {
		decl.warn(
			result,
			`"${originalForWarnings}" is out of gamut for "display-p3". Given "preserve: true" is set, this will lead to unexpected results in some browsers.`,
		);
	}

	node.nodes.splice(0, 0, displayP3Node());
	node.nodes.splice(1, 0, spaceNode());

	replaceWith(node.nodes, channelNode1, {
		...channelNode1,
		value: rgbValues[0].toFixed(5),
	});

	replaceWith(node.nodes, channelNode2, {
		...channelNode2,
		value: rgbValues[1].toFixed(5),
	});

	replaceWith(node.nodes, channelNode3, {
		...channelNode3,
		value: rgbValues[2].toFixed(5),
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

function spaceNode(): SpaceNode {
	return {
		sourceIndex: 0,
		sourceEndIndex: 1,
		value: ' ',
		type: 'space',
	};
}

function displayP3Node(): WordNode {
	return {
		sourceIndex: 0,
		sourceEndIndex: 10,
		value: 'display-p3',
		type: 'word',
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

	const unitAndValueUnit = unitAndValue.unit.toLowerCase();

	return !!unitAndValue.number && (
		unitAndValueUnit === 'deg' ||
		unitAndValueUnit === 'grad' ||
		unitAndValueUnit === 'rad' ||
		unitAndValueUnit === 'turn' ||
		unitAndValueUnit === ''
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

type Lch = {
	l: Dimension,
	lNode: Node,
	c: Dimension,
	cNode: Node,
	h: Dimension,
	hNode: Node,
	slash?: DivNode,
	alpha?: WordNode|FunctionNode,
}

function oklchFunctionContents(nodes): Lch|null {
	if (!isNumericNodePercentageOrNumber(nodes[0])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodeHueLike(nodes[2])) {
		return null;
	}

	const out: Lch = {
		l: valueParser.unit(nodes[0].value) as Dimension,
		lNode: nodes[0],
		c: valueParser.unit(nodes[1].value) as Dimension,
		cNode: nodes[1],
		h: valueParser.unit(nodes[2].value) as Dimension,
		hNode: nodes[2],
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

	if (nodes.length > 3 && (!out.slash || !out.alpha)) {
		return null;
	}

	// 0% = 0.0, 100% = 1.0
	if (out.l.unit === '%') {
		out.l.unit = '';
		out.l.number = (parseFloat(out.l.number) / 100).toFixed(10);
	}

	// -100% = -0.4, 100% = 0.4
	if (out.c.unit === '%') {
		out.c.unit = '';
		out.c.number = ((parseFloat(out.c.number) / 100) * 0.4).toFixed(10);
	}

	return out;
}

type Lab = {
	l: Dimension,
	lNode: Node,
	a: Dimension,
	aNode: Node,
	b: Dimension,
	bNode: Node,
	slash?: DivNode,
	alpha?: WordNode | FunctionNode,
}

function oklabFunctionContents(nodes): Lab|null {
	if (!isNumericNodePercentageOrNumber(nodes[0])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[2])) {
		return null;
	}

	const out: Lab = {
		l: valueParser.unit(nodes[0].value) as Dimension,
		lNode: nodes[0],
		a: valueParser.unit(nodes[1].value) as Dimension,
		aNode: nodes[1],
		b: valueParser.unit(nodes[2].value) as Dimension,
		bNode: nodes[2],
	};

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]) || isVarNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	if (nodes.length > 3 && (!out.slash || !out.alpha)) {
		return null;
	}

	// 0% = 0.0, 100% = 1.0
	if (out.l.unit === '%') {
		out.l.unit = '';
		out.l.number = (parseFloat(out.l.number) / 100).toFixed(10);
	}

	// -100% = -0.4, 100% = 0.4
	if (out.a.unit === '%') {
		out.a.unit = '';
		out.a.number = ((parseFloat(out.a.number) / 100) * 0.4).toFixed(10);
	}

	// -100% = -0.4, 100% = 0.4
	if (out.b.unit === '%') {
		out.b.unit = '';
		out.b.number = ((parseFloat(out.b.number) / 100) * 0.4).toFixed(10);
	}

	return out;
}

function isLab(x: Lch | Lab): x is Lab {
	if (typeof (x as Lab).a !== 'undefined') {
		return true;
	}

	return false;
}

function channelNodes(x: Lch | Lab): [Node, Node, Node] {
	if (isLab(x)) {
		return [x.lNode, x.aNode, x.bNode];
	}

	return [x.lNode, x.cNode, x.hNode];
}

function channelDimensions(x: Lch | Lab): [Dimension, Dimension, Dimension] {
	if (isLab(x)) {
		return [x.l, x.a, x.b];
	}

	return [x.l, x.c, x.h];
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
