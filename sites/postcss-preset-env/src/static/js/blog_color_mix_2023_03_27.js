import { color, serializeP3, serializeRGB } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

const cylindrical = new Set(['hsl', 'hwb', 'lch', 'oklch']);
const supportsP3AndP3Gamut = CSS.supports('(color: color(display-p3 0 0 0))') && window.matchMedia('(color-gamut: p3)').matches;

function renderResult() {
	const colorSpaceInput = document.getElementById('color-space');
	if (!colorSpaceInput) {
		return;
	}

	const interpolationMethodInput = document.getElementById('interpolation-method');
	if (!interpolationMethodInput) {
		return;
	}

	const colorMixOutput = document.getElementById('output-color-mix');
	if (!colorMixOutput) {
		return;
	}

	const colorMixOutputCSS = document.getElementById('output-color-mix-css');
	if (!colorMixOutputCSS) {
		return;
	}

	const colorMixPercentage = document.getElementById('color-mix-percentage');
	if (!colorMixPercentage) {
		return;
	}

	const colorInputA = document.getElementById('color-a');
	if (!colorInputA) {
		return;
	}

	const colorOutputA = document.getElementById('output-color-a');
	if (!colorOutputA) {
		return;
	}

	const colorInputB = document.getElementById('color-b');
	if (!colorInputB) {
		return;
	}

	const colorOutputB = document.getElementById('output-color-b');
	if (!colorOutputB) {
		return;
	}

	colorOutputA.value = colorInputA.value;
	colorOutputA.style.setProperty('--color', colorInputA.value);
	colorOutputB.value = colorInputB.value;
	colorOutputB.style.setProperty('--color', colorInputB.value);

	let colorMix = `color-mix(in ${colorSpaceInput.value}, ${colorInputA.value}, ${colorInputB.value} ${colorMixPercentage.value}%)`;
	if (cylindrical.has(colorSpaceInput.value)) {
		colorMix = `color-mix(in ${colorSpaceInput.value} ${interpolationMethodInput.value} hue, ${colorInputA.value}, ${colorInputB.value} ${colorMixPercentage.value}%)`;
	}

	colorMixOutputCSS.value = colorMix;

	const parsedColorValue = color(parseComponentValue(tokenize({ css: colorMix })));
	if (!parsedColorValue) {
		colorMixOutput.style.outline = '1px solid rgb(255 0 0 / 25%)';
		return;
	}

	colorMixOutput.style.outline = 'none';

	const outputColorValueRGB = serializeRGB(parsedColorValue);
	const outputColorValueP3 = serializeP3(parsedColorValue);

	if (supportsP3AndP3Gamut) {
		colorMixOutput.value = outputColorValueP3;
		colorMixOutput.style.setProperty('--color', outputColorValueP3);
	} else {
		colorMixOutput.value = outputColorValueRGB;
		colorMixOutput.style.setProperty('--color', outputColorValueRGB);
	}
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
