import { color, serializeOKLCH, serializeP3, serializeRGB } from '@csstools/css-color-parser';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

function renderResult() {
	document.querySelectorAll('.color-input').forEach((inputEl) => {
		const outputElRGB = document.querySelector(`.color-output-rgb[for="${inputEl.id}"]`);
		if (!outputElRGB) {
			return;
		}

		const outputElP3 = document.querySelector(`.color-output-p3[for="${inputEl.id}"]`);
		if (!outputElP3) {
			return;
		}

		const outputElOKLCH = document.querySelector(`.color-output-oklch[for="${inputEl.id}"]`);
		if (!outputElOKLCH) {
			return;
		}

		const value = inputEl.value;
		if (!value) {
			return;
		}

		const parsedColorValue = color(parseComponentValue(tokenize({ css: value.trim() })));
		if (!parsedColorValue) {
			inputEl.style.outline = '1px solid rgb(255 0 0 / 25%)';
			return;
		}

		inputEl.style.outline = 'none';

		const outputColorValueRGB = serializeRGB(parsedColorValue);
		const outputColorValueP3 = serializeP3(parsedColorValue);
		const outputColorValueOKLCH = serializeOKLCH(parsedColorValue);

		outputElRGB.value = outputColorValueRGB;
		outputElRGB.style.setProperty('--color', outputColorValueRGB);
		outputElP3.value = outputColorValueP3;
		outputElP3.style.setProperty('--color', outputColorValueP3);
		outputElOKLCH.value = outputColorValueOKLCH;
		outputElOKLCH.style.setProperty('--color', outputColorValueOKLCH);
	});
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
