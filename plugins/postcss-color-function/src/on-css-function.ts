import type { Declaration, Result } from 'postcss';
import type { FunctionNode, Dimension, Node, DivNode, WordNode } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { a98RgbToSRgb } from './convert-a98-rgb-to-srgb';
import { cieXyz50ToSRgb } from './convert-cie-xyz-50-to-srgb';
import { cieXyz65ToSRgb } from './convert-cie-xyz-65-to-srgb';
import { displayP3ToSRgb } from './convert-display-p3-to-srgb';
import { prophotoRgbToSRgb } from './convert-prophoto-rgb-to-srgb';
import { rec2020ToSRgb } from './convert-rec2020-to-srgb';
import { sRgbLinearToSRgb } from './convert-srgb-linear-to-srgb';
import { sRgbToSRgb } from './convert-srgb-to-srgb';
import { inGamut } from './css-color-4/map-gamut';

export function onCSSFunctionSRgb(node: FunctionNode, decl: Declaration, result: Result, preserve: boolean) {
	const originalForWarnings = valueParser.stringify(node);

	const value = node.value;
	const rawNodes = node.nodes;
	const relevantNodes = rawNodes.slice().filter((x) => {
		return x.type !== 'comment' && x.type !== 'space';
	});

	let nodes: Color | null = null;
	if (value.toLowerCase() === 'color') {
		nodes = colorFunctionContents(relevantNodes);
	}

	if (!nodes) {
		return;
	}

	// rename the Color function to `rgb`
	node.value = 'rgb';

	transformAlpha(node, nodes.slash, nodes.alpha);

	/** Corresponding Color transformer. */
	let toRGB: (x: [number, number, number]) => [number, number, number];
	switch (nodes.colorSpace) {
		case 'srgb':
			toRGB = sRgbToSRgb;
			break;
		case 'srgb-linear':
			toRGB = sRgbLinearToSRgb;
			break;
		case 'a98-rgb':
			toRGB = a98RgbToSRgb;
			break;
		case 'prophoto-rgb':
			toRGB = prophotoRgbToSRgb;
			break;
		case 'display-p3':
			toRGB = displayP3ToSRgb;
			break;
		case 'rec2020':
			toRGB = rec2020ToSRgb;
			break;
		case 'xyz-d50':
			toRGB = cieXyz50ToSRgb;
			break;
		case 'xyz-d65':
			toRGB = cieXyz65ToSRgb;
			break;
		case 'xyz':
			toRGB = cieXyz65ToSRgb;
			break;
		default:
			return;
	}

	/** RGB channels from the source color. */
	const channelNumbers: [number, number, number] = channelDimensions(nodes).map(
		channelNumber => parseFloat(channelNumber.number),
	) as [number, number, number];

	const rgbValues = toRGB(
		channelNumbers,
	);

	if (!inGamut(channelNumbers) && preserve) {
		decl.warn(
			result,
			`"${originalForWarnings}" is out of gamut for "${nodes.colorSpace}". Given "preserve: true" is set, this will lead to unexpected results in some browsers.`,
		);
	}

	node.nodes = [
		{
			sourceIndex: 0,
			sourceEndIndex: 1,
			value: String(Math.round(rgbValues[0] * 255)),
			type: 'word',
		},
		commaNode(),
		{
			sourceIndex: 0,
			sourceEndIndex: 1,
			value: String(Math.round(rgbValues[1] * 255)),
			type: 'word',
		},
		commaNode(),
		{
			sourceIndex: 0,
			sourceEndIndex: 1,
			value: String(Math.round(rgbValues[2] * 255)),
			type: 'word',
		},
	];

	if (nodes.alpha) {
		node.nodes.push(commaNode());
		node.nodes.push(nodes.alpha);
	}
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

function zeroNode(): WordNode {
	return {
		sourceIndex: 0,
		sourceEndIndex: 1,
		value: '0',
		type: 'word',
	};
}

function isColorSpaceNode(node: Node): node is WordNode {
	if (!node || node.type !== 'word') {
		return false;
	}

	switch (node.value.toLowerCase()) {
		case 'srgb':
		case 'srgb-linear':
		case 'display-p3':
		case 'a98-rgb':
		case 'prophoto-rgb':
		case 'rec2020':
		case 'xyz-d50':
		case 'xyz-d65':
		case 'xyz':
			return true;
		default:
			return false;
	}
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

type Color = {
	colorSpace: string,
	colorSpaceNode: Node,
	parameters: Array<{
		value: Dimension,
		node: Node,
	}>
	slash?: DivNode,
	alpha?: WordNode | FunctionNode,
}

function colorFunctionContents(nodes): Color|null {
	if (!isColorSpaceNode(nodes[0])) {
		return null;
	}

	const out: Color = {
		colorSpace: nodes[0].value.toLowerCase(),
		colorSpaceNode: nodes[0],
		parameters: [],
	};

	for (let i = 1; i < nodes.length; i++) {
		if (isSlashNode(nodes[i])) {
			out.slash = nodes[i];
			continue;
		}

		if (out.slash) {
			if ((isNumericNodePercentageOrNumber(nodes[i]) || isCalcNode(nodes[i]) || isVarNode(nodes[i]))) {
				out.alpha = nodes[i];
				break;
			}
		}

		if (isNumericNodePercentageOrNumber(nodes[i])) {
			const unitAndValue = valueParser.unit(nodes[i].value) as Dimension;
			if (unitAndValue.unit === '%') {
				// transform the channel from a Percentage to (0-1) Number
				unitAndValue.number = String(parseFloat(unitAndValue.number) / 100);
				unitAndValue.unit = '';
				nodes[i].value = String(unitAndValue.number);
			}

			out.parameters.push({
				value: unitAndValue,
				node: nodes[i],
			});
		} else {
			return null;
		}
	}

	if (out.parameters.length === 0) {
		// need at least one channel value
		return out;
	}

	if (out.parameters.length < 3) {
		out.parameters = [
			...out.parameters,
			// fill with zero values
			{
				node: zeroNode(),
				value: {
					number: '0',
					unit: '',
				},
			},
			{
				node: zeroNode(),
				value: {
					number: '0',
					unit: '',
				},
			},
		];
	}

	// Trim to 3 channels.
	// We only support conversion to rgb which has 3 channels.
	if (out.parameters.length > 3) {
		out.parameters = out.parameters.slice(0, 3);
	}

	return out;
}

function channelDimensions(x: Color): [Dimension, Dimension, Dimension] {
	return x.parameters.map((parameter) => {
		return parameter.value;
	}) as [Dimension, Dimension, Dimension];
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
