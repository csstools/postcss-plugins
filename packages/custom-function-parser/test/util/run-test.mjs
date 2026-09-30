import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@csstools/custom-function-parser';

export function runTest(source, testPath, assertEqual) {
	const resultAST = parse(source);

	const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

	if (process.env['REWRITE_EXPECTS'] === 'true') {
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), resultAST_JSON);
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.result.json`), resultAST_JSON);
	} else {
		const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), 'utf-8').toString());

		if (expectData === false) {
			assertEqual(
				resultAST,
				expectData,
			);
		} else {
			assertEqual(
				resultAST.toString(),
				expectData.string,
			);

			assertEqual(
				resultAST.toString(),
				source,
			);
		}

		assertEqual(
			JSON.parse(resultAST_JSON),
			expectData,
		);
	}
}
