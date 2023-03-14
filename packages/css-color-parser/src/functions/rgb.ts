import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { normalize_legacy_sRGB_ChannelValues, normalize_modern_sRGB_ChannelValues } from './rgb-normalize-channel-values';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function rgb(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	{
		const output = rgbCommaSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	}

	{
		const output = rgbSpaceSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	}

	// {
	// 	const output = rgbSpaceSeparated_RCS(rgbNode, colorParser);
	// 	if (output !== false) {
	// 		return output;
	// 	}
	// }

	return false;
}

function rgbCommaSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelLegacySyntax(
		rgbNode,
		normalize_legacy_sRGB_ChannelValues,
		ColorNotation.RGB,
		[
			SyntaxFlag.LegacyRGB,
		],
	);
}

function rgbSpaceSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelSpaceSeparated(
		rgbNode,
		normalize_modern_sRGB_ChannelValues,
		ColorNotation.RGB,
		[],
	);
}

// function rgbSpaceSeparated_RCS(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
// 	let globals: Map<string, TokenNumber> | null = null;
// 	let alpha: number | ComponentValue = 1;
// 	const r: Array<TokenNumber> = [];
// 	const g: Array<TokenNumber> = [];
// 	const b: Array<TokenNumber> = [];
// 	const a: Array<TokenNumber> = [];

// 	const colorData: ColorData = {
// 		channels: [0, 0, 0],
// 		colorSpace: ColorSpace.XYZ_D50,

// 		sourceColorSpace: ColorSpace.sRGB,
// 		alpha: 0,
// 		missingComponents: [false, false, false, false],
// 		syntaxFlags: (new Set([SyntaxFlag.RelativeColorSyntax])),
// 	};

// 	let focus = r;
// 	for (let i = 0; i < rgbNode.value.length; i++) {
// 		let node = rgbNode.value[i];
// 		if (isWhitespaceNode(node) || isCommentNode(node)) {
// 			// consume as much whitespace as possible
// 			while (isWhitespaceNode(rgbNode.value[i + 1]) || isCommentNode(rgbNode.value[i + 1])) {
// 				i++;
// 			}

// 			if (!r.length) {
// 				continue;
// 			}

// 			if (focus === r) {
// 				focus = g;
// 				continue;
// 			}

// 			if (focus === g) {
// 				focus = b;
// 				continue;
// 			}

// 			continue;
// 		}

// 		if (
// 			isTokenNode(node) &&
// 			!globals &&
// 			node.value[0] === TokenType.Ident &&
// 			toLowerCaseAZ(node.value[4].value) === 'from'
// 		) {
// 			// consume as much whitespace as possible
// 			while (isWhitespaceNode(rgbNode.value[i + 1]) || isCommentNode(rgbNode.value[i + 1])) {
// 				i++;
// 			}

// 			const nextNode = rgbNode.value[i + 1];
// 			const fromColor = colorDataToColorSpace(colorParser(nextNode), ColorSpace.sRGB);
// 			if (fromColor === false) {
// 				return false;
// 			}

// 			globals = colorDataChannelsToCalcGlobals(fromColor);
// 			alpha = fromColor.alpha;

// 			i++;
// 			continue;
// 		}

// 		if (!globals) {
// 			return false;
// 		}

// 		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
// 			if (focus === a) {
// 				return false;
// 			}

// 			focus = a;
// 			continue;
// 		}

// 		if (isFunctionNode(node)) {
// 			if (toLowerCaseAZ(node.getName()) !== 'calc') {
// 				return false;
// 			}

// 			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100, globals: globals });
// 			if (!result || !isTokenNode(result)) {
// 				return false;
// 			}

// 			node = result;
// 		}

// 		if (isTokenNode(node)) {
// 			if (node.value[0] === TokenType.Ident) {
// 				const token = node.value;
// 				const value = globals.get(toLowerCaseAZ(token[4].value));
// 				if (!value) {
// 					return false;
// 				}

// 				node = new TokenNode(value);
// 			}

// 			if (node.value[0] === TokenType.Percentage) {
// 				const token = node.value;

// 				focus.push([
// 					TokenType.Number,
// 					(token[4].value / 100).toString(),
// 					token[2],
// 					token[3],
// 					{
// 						value: token[4].value / 100,
// 						type: NumberType.Number,
// 					},
// 				]);
// 				continue;
// 			}

// 			if (node.value[0] === TokenType.Number) {
// 				let scale = 255;
// 				if (focus === a) {
// 					scale = 1;
// 				}

// 				const token = node.value;

// 				focus.push([
// 					TokenType.Number,
// 					(token[4].value / scale).toString(),
// 					token[2],
// 					token[3],
// 					{
// 						value: token[4].value / scale,
// 						type: NumberType.Number,
// 					},
// 				]);
// 				continue;
// 			}
// 		}

// 		return false;
// 	}

// 	if (focus.length !== 1) {
// 		return false;
// 	}

// 	if (
// 		r.length !== 1 ||
// 		g.length !== 1 ||
// 		b.length !== 1
// 	) {
// 		return false;
// 	}

// 	colorData.channels = xyz.sRGB_to_XYZ_D50([
// 		r[0][4].value,
// 		g[0][4].value,
// 		b[0][4].value,
// 	]);
// 	colorData.alpha = a.length === 1 ? a[0][4].value : alpha;

// 	return colorData;
// }
