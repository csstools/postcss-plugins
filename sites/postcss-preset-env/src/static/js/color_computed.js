import { tokenize } from "@csstools/css-tokenizer";
import { color, computedValue } from "@csstools/css-color-parser";
import { parseComponentValue } from "@csstools/css-parser-algorithms";

function readState() {
	try {
		const hash = window.location.hash.slice(1);
		if (!hash) {
			return;
		}

		const state = JSON.parse(window.decodeURIComponent(window.atob(hash)));
		if (!state.ci) {
			return;
		}

		const inputEl = document.querySelector('.color-input');
		if (!inputEl) {
			return;
		}

		inputEl.value = state.ci;
		renderResult();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
}

function writeState() {
	try {
		window.location.hash = window.btoa(window.encodeURIComponent(JSON.stringify({
			ci: document.querySelector('.color-input')?.value,
		})));
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
}

function renderResult() {
	const inputEl = document.querySelector('.color-input');
	if (!inputEl) {
		return;
	}

	writeState();

	const outputElComputed = document.getElementById('color-output-computed');
	if (!outputElComputed) {
		return;
	}

	const outputElComputedNative = document.getElementById('color-output-computed-native');
	if (!outputElComputedNative) {
		return;
	}

	const value = inputEl.value;
	if (!value) {
		return;
	}

	{
		outputElComputedNative.style.color = value.trim();
		const computedValue = window.getComputedStyle(outputElComputedNative).color;
		outputElComputedNative.style.color = null;

		outputElComputedNative.style.setProperty('--color', value.trim());
		outputElComputedNative.value = computedValue;
	}

	{
		const parsedColorValue = color(parseComponentValue(tokenize({ css: value.trim() })));
		if (!parsedColorValue) {
			inputEl.style.outline = '2px solid rgb(255 0 0)';
			return;
		}

		let outputColorValueComputed = computedValue(parsedColorValue);
		try {
			outputColorValueComputed = computedValue(parsedColorValue);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}

		if (!outputColorValueComputed) {
			inputEl.style.outline = '2px solid rgb(255 0 0)';
			return;
		}

		inputEl.style.outline = 'none';

		outputElComputed.value = outputColorValueComputed;
		outputElComputed.style.setProperty('--color', outputColorValueComputed);
	}
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);

readState();
