import { tokenize } from "@csstools/css-tokenizer";
import { color } from "@csstools/css-color-parser";
import { parseComponentValue } from "@csstools/css-parser-algorithms";

function nanToNone(component, unit = '') {
	if (Number.isNaN(component)) {
		return `none`;
	}

	if (unit) {
		return component.toString() + unit;
	}

	return component;
}

function reducePrecision(x, factor = 8) {
	if (Number.isNaN(x) || !Number.isFinite(x)) {
		return x;
	}

	factor = Math.pow(10, factor);

	return Math.round(x * factor) / factor;
}

function computedColor(declared) {
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
				return computedColor(`color(from ${declared} srgb r g b / alpha)`);
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
				return computedColor(`color(from ${declared} srgb r g b / alpha)`);
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
				return computedColor(`color(from ${declared} srgb r g b / alpha)`);
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
				return `color(xyz-d65 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])} / ${nanToNone(colorData.alpha)})`;
			}

			return `color(xyz-d65 ${nanToNone(colorData.channels[0])} ${nanToNone(colorData.channels[1])} ${nanToNone(colorData.channels[2])})`;

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


function renderResult() {
	document.querySelectorAll('.color-input').forEach((inputEl) => {
		const outputElComputed = document.querySelector(`.color-output-computed[for="${inputEl.id}"]`);
		if (!outputElComputed) {
			return;
		}

		const value = inputEl.value;
		if (!value) {
			return;
		}

		const parsedColorValue = color(parseComponentValue(tokenize({ css: value.trim() })));
		if (!parsedColorValue) {
			inputEl.style.outline = '2px solid rgb(255 0 0)';
			return;
		}

		const outputColorValueComputed = computedColor(value.trim());
		if (!outputColorValueComputed) {
			inputEl.style.outline = '2px solid rgb(255 0 0)';
			return;
		}

		inputEl.style.outline = 'none';

		outputElComputed.value = outputColorValueComputed;
		outputElComputed.style.setProperty('--color', outputColorValueComputed);
	});
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
