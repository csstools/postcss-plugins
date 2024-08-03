import fs from 'node:fs';
import path from 'node:path';
import { isGeneralEnclosed, parse } from '@csstools/media-query-list-parser';

export function runTest(source, testPath, assertEqual, expectGeneralEnclosed = 0) {
	const resultAST = parse(source, {
		preserveInvalidMediaQueries: true,
	});

	const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

	if (process.env['REWRITE_EXPECTS'] === 'true') {
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), resultAST_JSON);
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.result.json`), resultAST_JSON);
	} else {
		const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), 'utf-8').toString());

		assertEqual(
			resultAST.map((x) => x.toString()).join(','),
			expectData.map((x) => x.string).join(','),
		);

		assertEqual(
			JSON.parse(resultAST_JSON),
			expectData,
		);

		let generalEnclosedCounter = 0;
		resultAST.map((x) => {
			x.walk((entry) => {
				if (isGeneralEnclosed(entry.node)) {
					generalEnclosedCounter++;
				}
			});
		});

		assertEqual(
			generalEnclosedCounter,
			expectGeneralEnclosed,
		);
	}
}
