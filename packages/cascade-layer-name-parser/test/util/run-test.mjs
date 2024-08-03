import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@csstools/cascade-layer-name-parser';

export function runTest(source, testPath, assertEqual, expectSuccess = true) {
	let err;
	const resultAST = parse(source, {
		onParseError: (parseError) => {
			err = parseError;
		},
	});

	const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

	if (process.env['REWRITE_EXPECTS'] === 'true') {
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), resultAST_JSON);
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.result.json`), resultAST_JSON);
	} else {
		if (expectSuccess) {
			if (err) {
				throw err;
			}
		} else {
			assertEqual(!!err, true);
		}

		const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`)).toString());

		assertEqual(
			JSON.parse(resultAST_JSON),
			expectData,
		);
	}
}
