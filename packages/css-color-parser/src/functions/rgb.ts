import { FunctionNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { xyz } from '@csstools/color-helpers';
import { ColorData } from '../color';
import { ColorSpace } from '../color-space';

export function rgb(rgbNode: FunctionNode): ColorData | -1 {
	{
		const output = rgbCommaSeparated(rgbNode);
		if (output !== -1) {
			return output;
		}
	}

	{
		const output = rgbSpaceSeparated(rgbNode);
		if (output !== -1) {
			return output;
		}
	}

	return -1;
}

function rgbCommaSeparated(rgbNode: FunctionNode): ColorData | -1 {
	const r: Array<TokenNumber> = [];
	const g: Array<TokenNumber> = [];
	const b: Array<TokenNumber> = [];
	const a: Array<TokenNumber> = [];

	let focus = r;
	for (let i = 0; i < rgbNode.value.length; i++) {
		let node = rgbNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
			if (focus === r) {
				focus = g;
				continue;
			}

			if (focus === g) {
				focus = b;
				continue;
			}

			if (focus === b) {
				focus = a;
				continue;
			}

			if (focus === a) {
				return -1;
			}
		}

		if (isFunctionNode(node)) {
			if (node.getName().toLowerCase() !== 'calc') {
				return -1;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (!result || !isTokenNode(result)) {
				return -1;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			let scale = 255;
			if (focus === a) {
				scale = 1;
			}

			if (node.value[0] === TokenType.Percentage) {
				const token = node.value;

				focus.push([
					TokenType.Number,
					(token[4].value / 100).toString(),
					token[2],
					token[3],
					{
						value: token[4].value / 100,
						type: NumberType.Number,
					},
				]);
				continue;
			}

			if (node.value[0] === TokenType.Number) {
				const token = node.value;

				focus.push([
					TokenType.Number,
					(token[4].value / scale).toString(),
					token[2],
					token[3],
					{
						value: token[4].value / scale,
						type: NumberType.Number,
					},
				]);
				continue;
			}
		}

		return -1;
	}

	if (focus.length !== 1) {
		return -1;
	}

	if (
		r.length !== 1 ||
		g.length !== 1 ||
		b.length !== 1
	) {
		return -1;
	}

	const xyzData = xyz.sRGB_to_XYZ_D50([
		r[0][4].value,
		g[0][4].value,
		b[0][4].value,
	]);

	const alpha = a.length === 1 ? a[0][4].value : 1;

	return {
		channels: xyzData,
		alpha: alpha,
		currentColorSpace: ColorSpace.XYZ_D50,
		sourceColorSpace: ColorSpace.sRGB,
	};
}

function rgbSpaceSeparated(rgbNode: FunctionNode): ColorData | -1 {
	const r: Array<TokenNumber> = [];
	const g: Array<TokenNumber> = [];
	const b: Array<TokenNumber> = [];
	const a: Array<TokenNumber> = [];

	let focus = r;
	for (let i = 0; i < rgbNode.value.length; i++) {
		let node = rgbNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(rgbNode.value[i + 1]) || isCommentNode(rgbNode.value[i + 1])) {
				i++;
			}

			if (focus === r) {
				focus = g;
				continue;
			}

			if (focus === g) {
				focus = b;
				continue;
			}

			continue;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
			if (focus === a) {
				return -1;
			}

			focus = a;
			continue;
		}

		if (isFunctionNode(node)) {
			if (node.getName().toLowerCase() !== 'calc') {
				return -1;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (!result || !isTokenNode(result)) {
				return -1;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			let scale = 255;
			if (focus === a) {
				scale = 1;
			}

			if (node.value[0] === TokenType.Percentage) {
				const token = node.value;

				focus.push([
					TokenType.Number,
					(token[4].value / 100).toString(),
					token[2],
					token[3],
					{
						value: token[4].value / 100,
						type: NumberType.Number,
					},
				]);
				continue;
			}

			if (node.value[0] === TokenType.Number) {
				const token = node.value;

				focus.push([
					TokenType.Number,
					(token[4].value / scale).toString(),
					token[2],
					token[3],
					{
						value: token[4].value / scale,
						type: NumberType.Number,
					},
				]);
				continue;
			}
		}

		return -1;
	}

	if (focus.length !== 1) {
		return -1;
	}

	if (
		r.length !== 1 ||
		g.length !== 1 ||
		b.length !== 1
	) {
		return -1;
	}

	const xyzData = xyz.sRGB_to_XYZ_D50([
		r[0][4].value,
		g[0][4].value,
		b[0][4].value,
	]);

	const alpha = a.length === 1 ? a[0][4].value : 1;

	return {
		channels: xyzData,
		alpha: alpha,
		currentColorSpace: ColorSpace.XYZ_D50,
		sourceColorSpace: ColorSpace.sRGB,
	};
}
