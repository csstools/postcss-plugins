import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { parseCommaSeparatedListOfComponentValues, parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { tokenizer } from '@csstools/css-tokenizer';

export function runTest(source, testPath, assertEqual, expectParseError = false) {
	test(testPath, () => {
		const onParseError = (err) => {
			if (expectParseError) {
				return;
			}

			// eslint-disable-next-line no-console
			console.warn(err);
			throw new Error(`Unable to parse "${source}"`);
		};
		const t = tokenizer({ css: source }, {
			onParseError: onParseError,
		});

		const tokens = [];

		{
			while (!t.endOfFile()) {
				tokens.push(t.nextToken());
			}

			tokens.push(t.nextToken()); // EOF-token
		}

		{
			// Space separated list of component values
			const resultAST = parseListOfComponentValues(tokens, {
				onParseError: onParseError,
			});
			const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

			if (process.env['REWRITE_EXPECTS'] === 'true') {
				fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-space.expect.json`), resultAST_JSON);
				fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-space.result.json`), resultAST_JSON);
			} else {
				const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-space.expect.json`)).toString());

				assertEqual(
					JSON.parse(resultAST_JSON),
					expectData,
				);
			}
		}

		{
			// Comma separated list of component values
			const resultAST = parseCommaSeparatedListOfComponentValues(tokens, {
				onParseError: onParseError,
			});
			const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

			if (process.env['REWRITE_EXPECTS'] === 'true') {
				fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-comma.expect.json`), resultAST_JSON);
				fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-comma.result.json`), resultAST_JSON);
			} else {
				const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.list-comma.expect.json`)).toString());

				assertEqual(
					JSON.parse(resultAST_JSON),
					expectData,
				);
			}
		}
	});
}
