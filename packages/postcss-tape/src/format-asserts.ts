import type { Warning } from 'postcss';
import type { TestCaseOptions } from './test-case-options';

export const dashesSeparator = '----------------------------------------';

export function formatCSSAssertError(testCaseLabel: string, testCaseOptions: TestCaseOptions, err: Error, forGithubAnnotation = false) {
	let formatted = '';
	formatted += `\n${testCaseLabel}\n\n`;

	if (testCaseOptions.message) {
		formatted += `message :\n  ${testCaseOptions.message}\n\n`;
	}

	if (testCaseOptions.options) {
		try {
			formatted += `options :\n${JSON.stringify(testCaseOptions.options, null, 2)}\n\n`;
		} catch (_) {
			// ignore
		}
	}

	formatted += `output changed :\n${prettyDiff(err.message)}\n`;

	if (!forGithubAnnotation) {
		formatted += '\n' + dashesSeparator;
	}

	return formatted;
}

export function formatWarningsAssertError(testCaseLabel: string, testCaseOptions: TestCaseOptions, actual: Array<Warning>, expected: number, forGithubAnnotation = false) {
	let formatted = '';
	formatted += `\n${testCaseLabel}\n\n`;

	if (testCaseOptions.message) {
		formatted += `message :\n  ${testCaseOptions.message}\n\n`;
	}

	if (testCaseOptions.options) {
		try {
			formatted += `options :\n${JSON.stringify(testCaseOptions.options, null, 2)}\n\n`;
		} catch (_) {
			// ignore
		}
	}

	formatted += `unexpected or missing warnings :\n+ actual ${actual.length}\n- expected ${expected}\n`;

	if (!forGithubAnnotation) {
		actual.forEach((warning) => {
			formatted += `\n[${warning.plugin}]: ${warning.text}`;
		});

		if (actual.length) {
			formatted += '\n';
		}

		formatted += '\n' + dashesSeparator;
	}

	return formatted;
}

function prettyDiff(assertMessage: string) {
	const newLineRegex = /[^\\](\\n)/gm;
	const tabRegex = /(\\t)/gm;
	return assertMessage.replace(newLineRegex, (match, p1) => { // decode new lines in CSS
		return match.replace(p1, ' ');
	}).replace(tabRegex, (match, p1) => { // decode tabs in CSS
		return match.replace(p1, ' ');
	}).replace(/\+$/gm, '').replace(/^Expected values to be strictly equal:\n/, ''); // remove trailing + outputted by `assert`
}
