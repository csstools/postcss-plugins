import { color, serializeP3, serializeRGB } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

function renderResult() {
	const mainHueEl = document.getElementById('relative-color-syntax-main-hue');
	if (!mainHueEl) {
		return;
	}

	const chromaFactorEl = document.getElementById('relative-color-syntax-chroma-factor');
	if (!chromaFactorEl) {
		return;
	}

	const hueSeparationEl = document.getElementById('relative-color-syntax-hue-separation');
	if (!hueSeparationEl) {
		return;
	}

	const mainHue = mainHueEl.value * 1;
	const chromaFactor = 20 - (1 * chromaFactorEl.value);
	const hueSeparation = hueSeparationEl.value * 1;

	const palettes = [
		{
			label: 'a',
			hue: mainHue + 180 - hueSeparation,
		},
		{
			label: 'b',
			hue: mainHue,
		},
		{
			label: 'c',
			hue: mainHue + 180 + hueSeparation,
		},
	];

	const lightness = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

	const colorValues = palettes.flatMap((palette) => {
		return lightness.map((lightnessValue) => {
			const startColor = `oklch(50% 50% ${palette.hue}deg)`;

			const backgroundColor = `oklch(
				from ${startColor}
				${lightnessValue}%
				calc((sin((l * 2 * PI) + (-1 * (PI / 2))) + 1) / ${chromaFactor})
				h
			)`;

			const foregroundColor = `oklab(
				from ${backgroundColor}
				clamp(0.2, ((sin((l * PI) + (PI / 2)) + 0.1) * 9999), 0.9)
				0
				0
			)`;

			return {
				label: `--color-${palette.label}-l-${lightnessValue}`,
				backgroundColor: color(parseComponentValue(tokenize({ css: backgroundColor.trim() }))),
				foregroundColor: color(parseComponentValue(tokenize({ css: foregroundColor.trim() }))),
			};
		});
	}).map((x) => {
		return {
			...x,
			backgroundColorRGB: serializeRGB(x.backgroundColor),
			backgroundColorP3: serializeP3(x.backgroundColor),
			foregroundColorRGB: serializeRGB(x.foregroundColor),
			foregroundColorP3: serializeP3(x.foregroundColor),
		};
	});

	let rgb = ':root {\n';
	let p3 = `
		@media (color-gamut: p3) {
			@supports (color: color(display-p3 1 1 1)) {
				:root {
	`;

	colorValues.forEach((colorValue) => {
		rgb += `${colorValue.label}-background: ${colorValue.backgroundColorRGB};\n`;
		rgb += `${colorValue.label}-foreground: ${colorValue.foregroundColorRGB};\n`;

		p3 += `${colorValue.label}-background: ${colorValue.backgroundColorP3};\n`;
	});

	rgb += '}\n';
	p3 += '}\n}\n}\n';

	document.getElementById('palette-styles').innerText = rgb + p3;
}

addEventListener('change', renderResult);
addEventListener('input', renderResult);
requestAnimationFrame(renderResult);
