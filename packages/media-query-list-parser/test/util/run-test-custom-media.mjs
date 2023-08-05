import fs from 'fs';
import path from 'path';
import { isGeneralEnclosed, parseCustomMedia } from '@csstools/media-query-list-parser';

export function runTestCustomMedia(source, testPath, assertEqual, expectGeneralEnclosed = 0) {
	const resultAST = parseCustomMedia(source, {
		preserveInvalidMediaQueries: true,
	});

	const resultAST_JSON = JSON.stringify(resultAST, null, '\t');

	if (process.env['REWRITE_EXPECTS'] === 'true') {
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), resultAST_JSON);
		fs.writeFileSync(path.join(process.cwd(), `./test/cases/${testPath}.result.json`), resultAST_JSON);
	} else {
		const expectData = JSON.parse(fs.readFileSync(path.join(process.cwd(), `./test/cases/${testPath}.expect.json`), 'utf-8').toString());
		if (resultAST === false) {
			assertEqual(resultAST, expectData);
			return;
		}

		assertEqual(
			resultAST.toString(),
			expectData.string,
		);

		assertEqual(
			JSON.parse(resultAST_JSON),
			expectData,
		);

		let generalEnclosedCounter = 0;
		if (resultAST.mediaQueryList) {
			resultAST.mediaQueryList.map((x) => {
				x.walk((entry) => {
					if (isGeneralEnclosed(entry.node)) {
						generalEnclosedCounter++;
					}
				});
			});
		}

		assertEqual(
			generalEnclosedCounter,
			expectGeneralEnclosed,
		);
	}
}
