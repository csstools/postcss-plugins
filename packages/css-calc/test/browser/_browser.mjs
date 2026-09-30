/* global window */
import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert';
import process from 'node:process';
import { calc } from '@csstools/css-calc';
import { approxEqual, propertyForResult } from './compare.mjs';
import { corpus } from './corpus.mjs';
import { generateCases } from './generate.mjs';
import { knownBrowserPrecisionDivergences, knownDivergenceKey, knownDivergencesThatNoLongerOccur } from './known-divergences.mjs';

const requestListener = async function (req, res) {
	const parsedUrl = new URL(req.url, 'http://localhost:8080');

	switch (parsedUrl.pathname) {
		case '':
		case '/':
			res.setHeader('Content-type', 'text/html');
			res.writeHead(200);
			res.end(await fs.readFile('test/browser/_browser.html', 'utf8'));
			break;
		default:
			res.setHeader('Content-type', 'text/plain');
			res.writeHead(404);
			res.end('Not found');
			break;
	}
};

function startServer() {
	const server = http.createServer(requestListener);
	server.listen(8080);

	return () => {
		server.close();
	};
}

const CONFIGS = [
	{ name: 'default', options: {} },
	{ name: 'canonical-units', options: { toCanonicalUnits: true } },
	{ name: 'raw-percentages', options: { rawPercentages: true } },
];

const expressions = [
	...new Set([
		...corpus,
		...generateCases({ seed: 0xC5C401C, count: 1200 }),
	]),
];

function buildCases() {
	const cases = [];

	for (const expression of expressions) {
		for (const config of CONFIGS) {
			let result;

			try {
				result = calc(expression, config.options);
			} catch {
				continue;
			}

			if (typeof result !== 'string') {
				continue;
			}

			const value = result.trim();
			if (!value || value === expression) {
				// The expression was not solved by `css-calc`; nothing to compare.
				continue;
			}

			const target = propertyForResult(value);
			if (!target) {
				continue;
			}

			cases.push({
				expression,
				result: value,
				property: target.property,
				unit: target.unit,
				config: config.name,
			});
		}
	}

	return cases;
}

function verify(caseItem, observation) {
	if (observation.expressionSpecified === '') {
		// The browser does not support (or rejects) the original expression.
		return null;
	}

	if (observation.resultSpecified === '') {
		return `[${caseItem.config}] css-calc result "${caseItem.result}" is invalid in the browser for "${caseItem.property}" (expression: "${caseItem.expression}")`;
	}

	// `expr * 0 + 1` differs from `0` only for `NaN`/`infinity`.
	// The computed value is `1` for finite input and `0` otherwise, which
	// differentiates `NaN` from a real `0` without inspecting serialized text.
	const expressionIsNonFinite = observation.expressionNaN === '0';
	const resultIsNonFinite = observation.resultNaN === '0';

	if (expressionIsNonFinite || resultIsNonFinite) {
		if (expressionIsNonFinite !== resultIsNonFinite) {
			return `[${caseItem.config}] expected both "${caseItem.expression}" and "${caseItem.result}" to be NaN/infinity; got "${observation.expressionSpecified}" and "${observation.resultSpecified}"`;
		}

		return null;
	}

	if (observation.expressionComputed === '' || observation.resultComputed === '') {
		return `[${caseItem.config}] missing computed value for "${caseItem.expression}" ("${observation.expressionComputed}") or "${caseItem.result}" ("${observation.resultComputed}")`;
	}

	const expressionNumber = parseFloat(observation.expressionComputed);
	const resultNumber = parseFloat(observation.resultComputed);

	if (Number.isNaN(expressionNumber) || Number.isNaN(resultNumber)) {
		return `[${caseItem.config}] could not parse computed values "${observation.expressionComputed}" / "${observation.resultComputed}" (expression: "${caseItem.expression}")`;
	}

	if (!approxEqual(expressionNumber, resultNumber)) {
		return `[${caseItem.config}] expected "${caseItem.expression}" (${observation.expressionComputed}) and "${caseItem.result}" (${observation.resultComputed}) to be equivalent in "${caseItem.property}"`;
	}

	// A `0` and a `-0` serialize the same, but are different values.
	// The sign of the zero is observed through `1 / sign(...)`.
	if (expressionNumber === 0 && resultNumber === 0 && observation.expressionZeroSign !== '' && observation.resultZeroSign !== '' && observation.expressionZeroSign !== observation.resultZeroSign) {
		return `[${caseItem.config}] expected "${caseItem.expression}" (${observation.expressionZeroSign}) and "${caseItem.result}" (${observation.resultZeroSign}) to have the same zero sign`;
	}

	return null;
}

// The documented `cssCalc` value in `knownBrowserPrecisionDivergences` is
// deterministic, so it can be checked without launching a browser. This keeps
// the documentation from drifting when `css-calc` changes.
test('known browser precision divergences documentation', () => {
	for (const divergence of knownBrowserPrecisionDivergences) {
		const config = CONFIGS.find((entry) => entry.name === divergence.config);
		assert.ok(config, `unknown config "${divergence.config}" for "${divergence.expression}"`);

		assert.strictEqual(
			calc(divergence.expression, config.options),
			divergence.cssCalc,
			`documented cssCalc value for "${divergence.expression}" (${divergence.config}) is stale`,
		);
	}
});

test('browser', { skip: !process.env.BROWSER_TESTS }, async () => {
	const cases = buildCases();
	assert.ok(cases.length > 0, 'expected at least one solvable expression');

	const cleanup = startServer();

	let browser;

	try {
		browser = await puppeteer.launch({
			headless: 'new',
		});

		const page = await browser.newPage();
		page.on('pageerror', (msg) => {
			throw msg;
		});

		await page.goto('http://localhost:8080');

		const observations = await page.evaluate((entries) => {
			return entries.map((entry) => {
				const expressionObservation = window.observe(entry.property, entry.expression);
				const resultObservation = window.observe(entry.property, entry.result);

				return {
					expressionSpecified: expressionObservation.specified,
					expressionComputed: expressionObservation.computed,
					resultSpecified: resultObservation.specified,
					resultComputed: resultObservation.computed,
					// `1` for finite, `0` for `NaN`/`infinity`, `''` for unsupported.
					expressionNaN: window.observeNaN(entry.property, entry.expression, entry.unit),
					resultNaN: window.observeNaN(entry.property, entry.result, entry.unit),
					expressionZeroSign: '',
					resultZeroSign: '',
				};
			});
		}, cases);

		const zeroSignEntries = [];
		for (let i = 0; i < cases.length; i++) {
			const observation = observations[i];

			if (observation.expressionNaN !== '1' || observation.resultNaN !== '1') {
				continue;
			}

			if (parseFloat(observation.expressionComputed) === 0 && parseFloat(observation.resultComputed) === 0) {
				zeroSignEntries.push(i);
			}
		}

		const zeroSigns = await page.evaluate((entries) => {
			return entries.map((entry) => {
				return {
					expression: window.observeZeroSign(entry.expression),
					result: window.observeZeroSign(entry.result),
				};
			});
		}, zeroSignEntries.map((i) => cases[i]));

		for (let i = 0; i < zeroSignEntries.length; i++) {
			const observation = observations[zeroSignEntries[i]];
			observation.expressionZeroSign = zeroSigns[i].expression;
			observation.resultZeroSign = zeroSigns[i].result;
		}

		const failures = [];
		const divergences = [];
		const usedDivergences = new Set();
		let checked = 0;

		for (let i = 0; i < cases.length; i++) {
			if (observations[i].expressionSpecified !== '') {
				checked++;
			}

			const failure = verify(cases[i], observations[i]);
			if (!failure) {
				continue;
			}

			const divergenceKey = knownDivergenceKey(cases[i], failure);
			if (divergenceKey) {
				usedDivergences.add(divergenceKey);
				divergences.push(failure);
				continue;
			}

			failures.push(failure);
		}

		assert.ok(checked >= 100, `expected at least 100 browser-checked cases, got ${checked}`);
		assert.deepStrictEqual(
			failures.slice(0, 25),
			[],
			`${failures.length} css-calc result(s) disagree with the browser:\n${failures.slice(0, 25).join('\n')}\n\nAlso see test/browser/known-divergences.mjs for documented browser differences.`,
		);

		const unusedDivergences = knownDivergencesThatNoLongerOccur(usedDivergences);
		assert.deepStrictEqual(
			unusedDivergences,
			[],
			`${unusedDivergences.length} documented divergence(s) no longer occur. Remove them from test/browser/known-divergences.mjs:\n${unusedDivergences.join('\n')}`,
		);

		if (divergences.length) {
			// eslint-disable-next-line no-console
			console.log(`ℹ ${divergences.length} case(s) hit a documented browser divergence.`);
		}
	} finally {
		await browser?.close();

		await cleanup();
	}
});
