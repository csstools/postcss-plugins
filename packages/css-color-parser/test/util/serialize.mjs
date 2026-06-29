import { serializeRGB, serializeP3, serializeOKLCH, serializeHSL, color } from '@csstools/css-color-parser';
import { isTokenDimension, isTokenNumeric, isTokenPercentage, mutateUnit, stringify, tokenize } from '@csstools/css-tokenizer';
import { parseComponentValue } from '@csstools/css-parser-algorithms';

export function serialize_sRGB_data(x, gamutMapping = true) {
	if (!x) {
		return '';
	}

	return serializeRGB(x, gamutMapping).toString();
}

export function serialize_HSL_data(x) {
	if (!x) {
		return '';
	}

	return serializeHSL(x).toString();
}

export function serialize_P3_data(x, gamutMapping = true) {
	if (!x) {
		return '';
	}

	return serializeP3(x, gamutMapping).toString();
}

export function serialize_OKLCH_data(x) {
	if (!x) {
		return '';
	}

	return serializeOKLCH(x).toString();
}

export function nanToNone(component, unit = '') {
	if (Number.isNaN(component)) {
		return 'none';
	}

	if (unit) {
		return component.toString() + unit;
	}

	return component;
}

export function reducePrecisionWholeValue(color) {
	const tokens = tokenize({ css: color.trim() });

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isTokenNumeric(token)) {
			let factor = Math.pow(10, 8);

			const y = Math.round(token[4].value * factor) / factor;

			if (isTokenDimension(token)) {
				token[4].value = y;
				mutateUnit(token, token[4].unit);
			} else if (isTokenPercentage(token)) {
				token[1] = y.toString() + '%';
			} else {
				token[1] = y.toString();
			}
		}
	}

	return stringify(...tokens);
}

export function reducePrecision(x, factor = 8) {
	if (Number.isNaN(x) || !Number.isFinite(x)) {
		return x;
	}

	factor = Math.pow(10, factor);

	return Math.round(x * factor) / factor;
}

export function computedValue(declared) {
	const colorData = color(parseComponentValue(tokenize({ css: declared })));
	if (!colorData) {
		return false;
	}

	switch (colorData.colorNotation) {
		case 'lab':
			colorData.channels[0] = nanToNone(colorData.channels[0]);
			colorData.channels[1] = nanToNone(colorData.channels[1]);
			colorData.channels[2] = nanToNone(colorData.channels[2]);
			colorData.alpha = nanToNone(colorData.alpha);

			if (colorData.alpha !== 1) {
				return `lab(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]} / ${colorData.alpha})`;
			}

			return `lab(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]})`;
		case 'lch':
			colorData.channels[0] = nanToNone(colorData.channels[0]);
			colorData.channels[1] = nanToNone(colorData.channels[1]);
			colorData.channels[2] = nanToNone(colorData.channels[2]);
			colorData.alpha = nanToNone(colorData.alpha);

			if (colorData.alpha !== 1) {
				return `lch(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]} / ${colorData.alpha})`;
			}

			return `lch(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]})`;
		case 'oklab':
			colorData.channels[0] = nanToNone(colorData.channels[0]);
			colorData.channels[1] = nanToNone(colorData.channels[1]);
			colorData.channels[2] = nanToNone(colorData.channels[2]);
			colorData.alpha = nanToNone(colorData.alpha);

			if (colorData.alpha !== 1) {
				return `oklab(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]} / ${colorData.alpha})`;
			}

			return `oklab(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]})`;
		case 'oklch':
			colorData.channels[0] = nanToNone(colorData.channels[0]);
			colorData.channels[1] = nanToNone(colorData.channels[1]);
			colorData.channels[2] = nanToNone(colorData.channels[2]);
			colorData.alpha = nanToNone(colorData.alpha);

			if (colorData.alpha !== 1) {
				return `oklch(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]} / ${colorData.alpha})`;
			}

			return `oklch(${colorData.channels[0]} ${colorData.channels[1]} ${colorData.channels[2]})`;
		case 'rgb':
			if (colorData.channels.some(Number.isNaN) || Number.isNaN(colorData.alpha)) {
				if (colorData.alpha !== 1) {
					return `color(srgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
				}

				return `color(srgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;
			}

			if (colorData.syntaxFlags.has('relative-color-syntax') || colorData.syntaxFlags.has('color-mix')) {
				return computedValue(`color(from ${declared} srgb r g b / alpha)`);
			}

			if (colorData.alpha !== 1) {
				return `rgba(${Math.round(nanToNone(reducePrecision(colorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(colorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(colorData.channels[2], 5) * 255))}, ${nanToNone(colorData.alpha)})`;
			}

			return `rgb(${Math.round(nanToNone(reducePrecision(colorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(colorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(colorData.channels[2], 5) * 255))})`;

		case 'hsl': {
			if (colorData.channels.some(Number.isNaN) || Number.isNaN(colorData.alpha)) {
				if (colorData.alpha !== 1) {
					return `hsl(${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1], '%')} ${nanToNone(colorData.channels[2], '%')} / ${nanToNone(colorData.alpha)})`;
				}

				return `hsl(${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1], '%')} ${nanToNone(colorData.channels[2], '%')})`;
			}

			if (colorData.syntaxFlags.has('relative-color-syntax') || colorData.syntaxFlags.has('color-mix')) {
				return computedValue(`color(from ${declared} srgb r g b / alpha)`);
			}

			const rgbColorData = color(parseComponentValue(tokenize({ css: `rgb(from ${declared} r g b / alpha)` })));
			if (rgbColorData.alpha !== 1) {
				return `rgba(${Math.round(nanToNone(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[2], 5) * 255))}, ${nanToNone(rgbColorData.alpha)})`;
			}

			return `rgb(${Math.round(nanToNone(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[2], 5) * 255))})`;
		}
		case 'hwb': {
			if (colorData.channels.some(Number.isNaN) || Number.isNaN(colorData.alpha)) {
				if (colorData.alpha !== 1) {
					return `hwb(${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1], '%')} ${nanToNone(colorData.channels[2], '%')} / ${nanToNone(colorData.alpha)})`;
				}

				return `hwb(${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1], '%')} ${nanToNone(colorData.channels[2], '%')})`;
			}

			if (colorData.syntaxFlags.has('relative-color-syntax') || colorData.syntaxFlags.has('color-mix')) {
				return computedValue(`color(from ${declared} srgb r g b / alpha)`);
			}

			const rgbColorData = color(parseComponentValue(tokenize({ css: `rgb(from ${declared} r g b / alpha)` })));
			if (rgbColorData.alpha !== 1) {
				return `rgba(${Math.round(nanToNone(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[2], 5) * 255))}, ${nanToNone(rgbColorData.alpha)})`;
			}

			return `rgb(${Math.round(nanToNone(reducePrecision(rgbColorData.channels[0], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[1], 5) * 255))}, ${Math.round(nanToNone(reducePrecision(rgbColorData.channels[2], 5) * 255))})`;
		}
		case 'srgb':
			if (colorData.alpha !== 1) {
				return `color(srgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(srgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'srgb-linear':
			if (colorData.alpha !== 1) {
				return `color(srgb-linear ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(srgb-linear ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'display-p3':
			if (colorData.alpha !== 1) {
				return `color(display-p3 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(display-p3 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'display-p3-linear':
			if (colorData.alpha !== 1) {
				return `color(display-p3-linear ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(display-p3-linear ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'a98-rgb':
			if (colorData.alpha !== 1) {
				return `color(a98-rgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(a98-rgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'prophoto-rgb':
			if (colorData.alpha !== 1) {
				return `color(prophoto-rgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(prophoto-rgb ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'rec2020':
			if (colorData.alpha !== 1) {
				return `color(rec2020 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(rec2020 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'xyz':
			if (colorData.alpha !== 1) {
				return `color(xyz ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(xyz ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'xyz-d50':
			if (colorData.alpha !== 1) {
				return `color(xyz-d50 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(xyz-d50 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

		case 'xyz-d65':
			if (colorData.alpha !== 1) {
				return `color(xyz-d65 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(xyz-d65 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;


		default:
			break;
	}

	throw new Error('unsupported color');
}

