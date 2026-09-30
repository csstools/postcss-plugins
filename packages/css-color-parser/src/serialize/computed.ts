import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { colorDataToForRelativeColorSyntax, SyntaxFlag, type ColorData} from '../color-data';
import { ColorNotation } from '../color-notation';

export function computedValue(color: ColorData, convertHslOrHwbToRGB: boolean = true): string {
	const channels: Array<string|number> = color.channels;

	switch (color.colorNotation) {
		case ColorNotation.Lab:
			channels[0] = nanToNone(channels[0]);
			channels[1] = nanToNone(channels[1]);
			channels[2] = nanToNone(channels[2]);

			if (color.alpha !== 1) {
				return `lab(${channels[0]} ${channels[1]} ${channels[2]} / ${nanToNone(color.alpha)})`;
			}

			return `lab(${channels[0]} ${channels[1]} ${channels[2]})`;
		case ColorNotation.LCH:
			channels[0] = nanToNone(channels[0]);
			channels[1] = nanToNone(channels[1]);
			channels[2] = nanToNone(normalizeHue(channels[2]));

			if (color.alpha !== 1) {
				return `lch(${channels[0]} ${channels[1]} ${channels[2]} / ${nanToNone(color.alpha)})`;
			}

			return `lch(${channels[0]} ${channels[1]} ${channels[2]})`;
		case ColorNotation.OKLab:
			channels[0] = nanToNone(channels[0]);
			channels[1] = nanToNone(channels[1]);
			channels[2] = nanToNone(channels[2]);

			if (color.alpha !== 1) {
				return `oklab(${channels[0]} ${channels[1]} ${channels[2]} / ${nanToNone(color.alpha)})`;
			}

			return `oklab(${channels[0]} ${channels[1]} ${channels[2]})`;
		case ColorNotation.OKLCH:
			channels[0] = nanToNone(channels[0]);
			channels[1] = nanToNone(channels[1]);
			channels[2] = nanToNone(normalizeHue(channels[2]));

			if (color.alpha !== 1) {
				return `oklch(${channels[0]} ${channels[1]} ${channels[2]} / ${nanToNone(color.alpha)})`;
			}

			return `oklch(${channels[0]} ${channels[1]} ${channels[2]})`;
		case ColorNotation.RGB:
		case ColorNotation.HEX:
			if (channels.some(Number.isNaN) || Number.isNaN(color.alpha)) {
				if (color.alpha !== 1) {
					return `color(srgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
				}

				return `color(srgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;
			}

			if (color.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax) || color.syntaxFlags.has(SyntaxFlag.ColorMix) || color.syntaxFlags.has(SyntaxFlag.RelativeAlphaSyntax)) {
				return computedValue(colorDataToForRelativeColorSyntax(color, ColorNotation.sRGB));
			}

			if (color.alpha !== 1) {
				return `rgba(${nanToNone(Math.round(reducePrecision(color.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(color.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(color.channels[2], 5) * 255))}, ${nanToNone(color.alpha)})`;
			}

			return `rgb(${nanToNone(Math.round(reducePrecision(color.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(color.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(color.channels[2], 5) * 255))})`;

		case ColorNotation.HSL: {
			if (channels.some(Number.isNaN) || Number.isNaN(color.alpha) || convertHslOrHwbToRGB === false) {
				if (color.alpha !== 1) {
					return `hsl(${nanToNone(normalizeHue(channels[0]))} ${nanToNone(channels[1], '%')} ${nanToNone(channels[2], '%')} / ${nanToNone(color.alpha)})`;
				}

				return `hsl(${nanToNone(normalizeHue(channels[0]))} ${nanToNone(channels[1], '%')} ${nanToNone(channels[2], '%')})`;
			}

			if (color.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax) || color.syntaxFlags.has(SyntaxFlag.ColorMix) || color.syntaxFlags.has(SyntaxFlag.RelativeAlphaSyntax)) {
				return computedValue(colorDataToForRelativeColorSyntax(color, ColorNotation.sRGB));
			}

			const rgbColorData = colorDataToForRelativeColorSyntax(color, ColorNotation.RGB);
			if (rgbColorData.alpha !== 1) {
				return `rgba(${nanToNone(Math.round(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[2], 5) * 255))}, ${nanToNone(rgbColorData.alpha)})`;
			}

			return `rgb(${nanToNone(Math.round(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[2], 5) * 255))})`;
		}
		case ColorNotation.HWB: {
			if (channels.some(Number.isNaN) || Number.isNaN(color.alpha) || convertHslOrHwbToRGB === false) {
				if (color.alpha !== 1) {
					return `hwb(${nanToNone(normalizeHue(channels[0]))} ${nanToNone(channels[1], '%')} ${nanToNone(channels[2], '%')} / ${nanToNone(color.alpha)})`;
				}

				return `hwb(${nanToNone(normalizeHue(channels[0]))} ${nanToNone(channels[1], '%')} ${nanToNone(channels[2], '%')})`;
			}

			if (color.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax) || color.syntaxFlags.has(SyntaxFlag.ColorMix) || color.syntaxFlags.has(SyntaxFlag.RelativeAlphaSyntax)) {
				return computedValue(colorDataToForRelativeColorSyntax(color, ColorNotation.sRGB));
			}

			const rgbColorData = colorDataToForRelativeColorSyntax(color, ColorNotation.RGB);
			if (rgbColorData.alpha !== 1) {
				return `rgba(${nanToNone(Math.round(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[2], 5) * 255))}, ${nanToNone(rgbColorData.alpha)})`;
			}

			return `rgb(${nanToNone(Math.round(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${nanToNone(Math.round(reducePrecision(rgbColorData.channels[2], 5) * 255))})`;
		}
		case ColorNotation.sRGB:
			if (color.alpha !== 1) {
				return `color(srgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(srgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.Linear_sRGB:
			if (color.alpha !== 1) {
				return `color(srgb-linear ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(srgb-linear ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.Display_P3:
			if (color.alpha !== 1) {
				return `color(display-p3 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(display-p3 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.Linear_Display_P3:
			if (color.alpha !== 1) {
				return `color(display-p3-linear ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(display-p3-linear ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.A98_RGB:
			if (color.alpha !== 1) {
				return `color(a98-rgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(a98-rgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.ProPhoto_RGB:
			if (color.alpha !== 1) {
				return `color(prophoto-rgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(prophoto-rgb ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.Rec2020:
			if (color.alpha !== 1) {
				return `color(rec2020 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(rec2020 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.XYZ_D65:
			if (color.alpha !== 1) {
				return `color(xyz-d65 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(xyz-d65 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		case ColorNotation.XYZ_D50:
			if (color.alpha !== 1) {
				return `color(xyz-d50 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])} / ${nanToNone(color.alpha)})`;
			}

			return `color(xyz-d50 ${nanToNone(channels[0])} ${nanToNone(channels[1])} ${nanToNone(channels[2])})`;

		default:
			break;
	}

	throw new Error('unsupported color');
}

function nanToNone(component: ComponentValue | number | string, unit = ''): string {
	if (typeof component === 'string') {
		return component;
	}

	if (typeof component !== 'number') {
		return component.toString();
	}

	if (Number.isNaN(component)) {
		return `none`;
	}

	if (unit) {
		return component.toString() + unit;
	}

	return component.toString();
}

function normalizeHue(component: ComponentValue | number | string): ComponentValue | number | string {
	if (typeof component !== 'number') {
		return component;
	}

	if (Number.isNaN(component)) {
		return component;
	}

	return component % 360;
}

function reducePrecision(x: number, factor: number = 8): number {
	if (Number.isNaN(x) || !Number.isFinite(x)) {
		return x;
	}

	factor = Math.pow(10, factor);

	return Math.round(x * factor) / factor;
}
