import type { ColorData } from '@csstools/css-color-parser';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { color, serializeRGB } from '@csstools/css-color-parser';
import { colorDataFitsRGB_Gamut } from '@csstools/css-color-parser';
import { serializeP3 } from '@csstools/css-color-parser';

export type ColorStop = {
	color: ComponentValue,
	colorData: ColorData,
	position: ComponentValue,
}

export function interpolateColorsInColorStopsList(colorStops: Array<ColorStop>, colorSpace: TokenNode, hueInterpolationMethod: TokenNode | null, wideGamut = false): Array<ComponentValue> | false {
	const result: Array<ComponentValue> = [];
	const interpolatedColorStops: Array<{
		color?: ComponentValue,
		colorData: ColorData,
		position?: ComponentValue,
	}> = [];

	for (let i = 0; i < (colorStops.length - 1); i++) {
		const colorStop = colorStops[i];
		const nextColorStop = colorStops[i + 1];

		interpolatedColorStops.push(colorStop);

		if (
			hueInterpolationMethod ||
			(
				serializeP3(colorStop.colorData, false).toString() !== serializeP3(nextColorStop.colorData, false).toString() &&
				colorStop.position.toString() !== nextColorStop.position.toString()
			)
		) {
			for (let j = 1; j <= 9; j++) {
				const multiplier = j * 10;

				let hueParts: Array<ComponentValue> = [];
				if (hueInterpolationMethod) {
					hueParts = [
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						hueInterpolationMethod,
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						new TokenNode([TokenType.Ident, 'hue', -1, -1, { value: 'hue' }]),
					];
				}

				const colorMix = new FunctionNode(
					[TokenType.Function, 'color-mix(', -1, -1, { value: 'color-mix' }],
					[TokenType.CloseParen, ')', -1, -1, undefined],
					[
						new TokenNode([TokenType.Ident, 'in', -1, -1, { value: 'in' }]),
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						colorSpace,
						...hueParts,
						new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						colorStop.color,
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						new TokenNode([TokenType.Percentage, `${100 - multiplier}%`, -1, -1, { value: 100 - multiplier }]),
						new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						nextColorStop.color,
						new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						new TokenNode([TokenType.Percentage, `${multiplier}%`, -1, -1, { value: multiplier }]),
					],
				);

				const mixedColor = color(colorMix);
				if (!mixedColor) {
					return false;
				}

				interpolatedColorStops.push({
					colorData: mixedColor,
				});
			}
		}

		if (i === (colorStops.length - 2)) {
			interpolatedColorStops.push(nextColorStop);
		}
	}

	for (let i = 0; i < interpolatedColorStops.length; i++) {
		if (wideGamut && !colorDataFitsRGB_Gamut(interpolatedColorStops[i].colorData)) {
			interpolatedColorStops[i].color = serializeP3(interpolatedColorStops[i].colorData, false);
		} else {
			interpolatedColorStops[i].color = serializeRGB(interpolatedColorStops[i].colorData, false);
		}
	}

	for (let i = 0; i < interpolatedColorStops.length; i++) {
		const colorStop = interpolatedColorStops[i];
		if (colorStop.position) {
			result.push(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				colorStop.color!,
				new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
				colorStop.position,

			);
		} else {
			result.push(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				colorStop.color!,
			);
		}

		if (i !== (interpolatedColorStops.length - 1)) {
			result.push(
				new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
				new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
			);
		}
	}

	return result;
}
