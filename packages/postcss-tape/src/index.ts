/* eslint-disable @typescript-eslint/no-var-requires */

import postcss from 'postcss';
import postcssOldestSupported from 'postcss-oldest-supported';
import path from 'path';
import { promises as fsp } from 'fs';
import { strict as assert } from 'assert';

import type { PluginCreator, Plugin } from 'postcss';
import { formatGitHubActionAnnotation } from './github-annotations.js';

const dashesSeparator = '----------------------------------------';

type TestCaseOptions = {
	message?: string,
	options?: unknown,
	plugins?: Array<Plugin>,
}

export default function runner(currentPlugin: PluginCreator<unknown>) {
	let hasErrors = false;

	return async (options: Record<string, TestCaseOptions>) => {
		for (const testCaseLabel in options) {
			const testCaseOptions = options[testCaseLabel];
			const testSourceFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.split(':')[0]);
			const testFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.replace(/:/g, '.'));

			const testFilePath = `${testSourceFilePathWithoutExtension}.css`;
			const expectFilePath = `${testFilePathWithoutExtension}.expect.css`;
			const resultFilePath = `${testFilePathWithoutExtension}.result.css`;

			const plugins = testCaseOptions.plugins ?? [currentPlugin(testCaseOptions.options)];

			const input = await fsp.readFile(testFilePath, 'utf8');
			const expected = await fsp.readFile(expectFilePath, 'utf8');
			const result = await postcss(plugins).process(input, {
				from: testFilePath,
				to: resultFilePath,
			});
			const resultString = result.css.toString();
			await fsp.writeFile(resultFilePath, resultString, 'utf8');

			try {
				assert.strictEqual(resultString, expected);
			} catch (err) {
				if (!hasErrors) {
					console.error(`\n[ERROR] test output changed!\n\n${dashesSeparator}`);
				}
				hasErrors = true;
				console.error(formatError(testCaseLabel, testCaseOptions, err));

				if (process.env.GITHUB_ACTIONS) {
					console.log(formatGitHubActionAnnotation(
						formatError(testCaseLabel, testCaseOptions, err, true),
						'error',
						{
							file: normalizeFilePathForGithubAnnotation(expectFilePath),
							line: 1,
							col: 1,
						},
					));
				}
			}
		}

		if (hasErrors) {
			process.exit(1);
		}
	};
}

function normalizeFilePathForGithubAnnotation(filePath: string) {
	// Any plugin or packages is located in `<workspace>/<package>`;
	const parts = process.cwd().split('/').slice(-2);

	const workspaces = [
		'packages',
		'plugins',
		'plugin-packs',
		'cli',
		'experimental',
	];

	if (!workspaces.includes(parts[0])) {
		throw new Error('PostCSS Tape was intended to be run from <workspace>/package');
	}

	return path.join(parts.join('/'), filePath);
}

function formatError(testCaseLabel, testCaseOptions, err, forGithubAnnotation = false) {
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

	formatted += `diff :\n${prettyDiff(err.message)}\n`;

	if (!forGithubAnnotation) {
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
