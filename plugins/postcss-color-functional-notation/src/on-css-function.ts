import valueParser from 'postcss-value-parser';
import type { FunctionNode, Dimension, Node, DivNode, WordNode, SpaceNode } from 'postcss-value-parser';

function onCSSFunction(node: FunctionNode) {
	const value = node.value.toLowerCase();
	if (!needsConversion(value === 'rgb' || value === 'rgba', node.nodes)) {
		return;
	}

	const rawNodes = convertOldSyntaxToNewSyntaxBeforeTransform(node.nodes);

	const relevantNodes = rawNodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	let nodes: Rgb | Hsl | null = null;
	if (value === 'hsl' || value === 'hsla') {
		nodes = hslFunctionContents(relevantNodes);
	} else if (value === 'rgb' || value === 'rgba') {
		nodes = rgbFunctionContents(relevantNodes);
	}

	if (!nodes) {
		return;
	}

	if (relevantNodes.length > 3 && (!nodes.slash || !nodes.alpha)) {
		return;
	}

	transformAlpha(node, nodes.slash, nodes.alpha);

	/** Extracted Color channels. */
	const [channelNode1, channelNode2] = channelNodes(nodes);

	node.nodes.splice(node.nodes.indexOf(channelNode1) + 1, 0, commaNode());
	node.nodes.splice(node.nodes.indexOf(channelNode2) + 1, 0, commaNode());
}

export default onCSSFunction;

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

	const lowerCaseUnit = unitAndValue.unit.toLowerCase();

	return !!unitAndValue.number && (
		lowerCaseUnit === 'deg' ||
		lowerCaseUnit === 'grad' ||
		lowerCaseUnit === 'rad' ||
		lowerCaseUnit === 'turn' ||
		unitAndValue.unit === ''
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

type Hsl = {
	h: Dimension,
	hNode: Node,
	s: Dimension,
	sNode: Node,
	l: Dimension,
	lNode: Node,
	slash?: DivNode,
	alpha?: WordNode|FunctionNode,
}

function hslFunctionContents(nodes): Hsl|null {
	if (!isNumericNodeHueLike(nodes[0])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[2])) {
		return null;
	}

	const out: Hsl = {
		h: valueParser.unit(nodes[0].value) as Dimension,
		hNode: nodes[0],
		s: valueParser.unit(nodes[1].value) as Dimension,
		sNode: nodes[1],
		l: valueParser.unit(nodes[2].value) as Dimension,
		lNode: nodes[2],
	};

	normalizeHueNode(out.h);
	if (out.h.unit !== '') {
		return null;
	}

	out.hNode.value = out.h.number;

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]) || isVarNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	return out;
}

type Rgb = {
	r: Dimension,
	rNode: Node,
	g: Dimension,
	gNode: Node,
	b: Dimension,
	bNode: Node,
	slash?: DivNode,
	alpha?: WordNode | FunctionNode,
}

function rgbFunctionContents(nodes): Rgb|null {
	if (!isNumericNodePercentageOrNumber(nodes[0])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[1])) {
		return null;
	}

	if (!isNumericNodePercentageOrNumber(nodes[2])) {
		return null;
	}

	const out: Rgb = {
		r: valueParser.unit(nodes[0].value) as Dimension,
		rNode: nodes[0],
		g: valueParser.unit(nodes[1].value) as Dimension,
		gNode: nodes[1],
		b: valueParser.unit(nodes[2].value) as Dimension,
		bNode: nodes[2],
	};

	if (out.r.unit === '%') {
		out.r.number = String(Math.floor(Number(out.r.number) / 100 * 255));
		out.rNode.value = out.r.number;
	}

	if (out.g.unit === '%') {
		out.g.number = String(Math.floor(Number(out.g.number) / 100 * 255));
		out.gNode.value = out.g.number;
	}

	if (out.b.unit === '%') {
		out.b.number = String(Math.floor(Number(out.b.number) / 100 * 255));
		out.bNode.value = out.b.number;
	}

	if (isSlashNode(nodes[3])) {
		out.slash = nodes[3];
	}

	if ((isNumericNodePercentageOrNumber(nodes[4]) || isCalcNode(nodes[4]) || isVarNode(nodes[4]))) {
		out.alpha = nodes[4];
	}

	return out;
}

function isRgb(x: Hsl | Rgb): x is Rgb {
	if (typeof (x as Rgb).r !== 'undefined') {
		return true;
	}

	return false;
}

function channelNodes(x: Hsl | Rgb): [Node, Node, Node] {
	if (isRgb(x)) {
		return [x.rNode, x.gNode, x.bNode];
	}

	return [x.hNode, x.sNode, x.lNode];
}

function transformAlpha(node: FunctionNode, slashNode: DivNode | undefined, alphaNode: WordNode | FunctionNode | undefined) {
	if (node.value.toLowerCase() === 'hsl' || node.value.toLowerCase() === 'hsla') {
		node.value = 'hsl';
	} else if (node.value.toLowerCase() === 'rgb' || node.value.toLowerCase() === 'rgba') {
		node.value = 'rgb';
	}

	if (!slashNode || !alphaNode) {
		return;
	}

	if (node.value.toLowerCase() === 'hsl') {
		node.value = 'hsla';
	} else {
		node.value = 'rgba';
	}

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

function normalizeHueNode(dimension: Dimension) {
	switch (dimension.unit.toLowerCase()) {
		case 'deg':
			dimension.unit = '';
			return;
		case 'rad':
			// radians -> degrees
			dimension.unit = '';
			dimension.number = Math.round(parseFloat(dimension.number) * 180 / Math.PI).toString();
			return;

		case 'grad':
			// grades -> degrees
			dimension.unit = '';
			dimension.number = Math.round(parseFloat(dimension.number) * 0.9).toString();
			return;

		case 'turn':
			// turns -> degrees
			dimension.unit = '';
			dimension.number = Math.round(parseFloat(dimension.number) * 360).toString();
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

function convertOldSyntaxToNewSyntaxBeforeTransform(nodes: Array<Node>): Array<Node> {
	// https://www.w3.org/TR/css-color-4/#rgb-functions
	// For legacy reasons, rgb() also supports an alternate syntax that separates all of its arguments with commas:
	// This also allows alpha values in comma separated `rgb` / `hsl` functions.
	//
	// This function replaces the first two comma's with spaces and the third with a slash.
	// Subsequent comma's are ignored as they are invalid in this syntax.

	let commaCounter = 0;
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (node.type === 'div' && node.value === ',') {
			if (commaCounter < 2) {
				node.value = ' ';
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((node as any) as SpaceNode).type = 'space';
			}

			if (commaCounter === 2) {
				node.value = '/';
			}

			if (commaCounter > 2) {
				return;
			}

			commaCounter++;
		}
	}

	return nodes;
}

function needsConversion(isRGB: boolean, nodes: Array<Node>) {
	let hasCommas = false;
	let hasPercentageAlpha = false;
	let isRGB_AndHasAnyPercentageValue = false;

	const relevantNodes = nodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	for (let i = 0; i < relevantNodes.length; i++) {
		const node = relevantNodes[i];
		if (node.type === 'word' && node.value.toLowerCase() === 'from') {
			// Too modern, not handled by this plugin
			return false;
		}

		if (node.type === 'div' && node.value === ',') {
			hasCommas = true;
			continue;
		}

		if (isRGB && node.type === 'word' && node.value.endsWith('%')) {
			isRGB_AndHasAnyPercentageValue = true;
			continue;
		}

		if (i === (nodes.length - 1) && node.type === 'word' && node.value.endsWith('%')) {
			hasPercentageAlpha = true;
			continue;
		}
	}

	if (hasCommas && (hasPercentageAlpha || isRGB_AndHasAnyPercentageValue)) {
		return true;
	}

	if (hasCommas) {
		return false;
	}

	return true;
}
