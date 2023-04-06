import { color, serializeP3, serializeRGB } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

const cylindrical = new Set(['hsl', 'hwb', 'lch', 'oklch']);
const supportsP3AndP3Gamut = CSS.supports('(color: color(display-p3 0 0 0))') && window.matchMedia('(color-gamut: p3)').matches;
const colorSpaceInput = document.getElementById('color-space');
const interpolationMethodInput = document.getElementById('interpolation-method');
const colorMixOutput = document.getElementById('output-color-mix');
const colorMixOutputCSS = document.getElementById('output-color-mix-css');
const colorMixPercentage = document.getElementById('color-mix-percentage');
const colorInputA = document.getElementById('color-a');
const colorOutputA = document.getElementById('output-color-a');
const colorInputB = document.getElementById('color-b');
const colorOutputB = document.getElementById('output-color-b');

function debounce(fn, wait = 1) {
	let timeout;

	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.call(this, ...args), wait);
	};
}

function disableTransition() {
	colorMixOutput.style.setProperty('transition', 'none');
}

function reEnableTransition() {
	colorMixOutput.style.setProperty('transition', null);
}

const debouncedReenable = debounce(reEnableTransition, 200);

function handleSliderInput() {
	disableTransition();
	renderResult();
	debouncedReenable();
}

function renderResult() {
	if (
		!colorSpaceInput ||
		!interpolationMethodInput ||
		!colorMixOutput ||
		!colorMixOutputCSS ||
		!colorMixPercentage ||
		!colorInputA ||
		!colorOutputA ||
		!colorInputB ||
		!colorOutputB
	) {
		return;
	}

	switch (colorSpaceInput.value) {
		case 'hsl':
		case 'hwb':
		case 'lch':
		case 'oklch':
			interpolationMethodInput.hidden = false;
			interpolationMethodInput.labels[0].hidden = false;
			break;
		default:
			interpolationMethodInput.hidden = true;
			interpolationMethodInput.labels[0].hidden = true;
			break;
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

colorMixPercentage.addEventListener('input', handleSliderInput);

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
