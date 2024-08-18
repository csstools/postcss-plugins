import { calc } from '@csstools/css-calc';

function renderResult() {
	const inputEl = document.getElementById('calc-input');
	if (!inputEl) {
		return;
	}

	const outputEl = document.getElementById('calc-output');
	if (!outputEl) {
		return;
	}

	const value = inputEl.value;
	if (!value) {
		return;
	}

	const wrappedValue = `calc(${value})`;
	const solved = calc(wrappedValue, { rawPercentages: true });
	if (solved === wrappedValue) {
		outputEl.value = value;
		return;
	}

	outputEl.value = solved;
}

addEventListener('change', renderResult);
addEventListener('keyup', renderResult);
