import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import fs from 'fs';

{
	const source = fs.readFileSync('./test/community/bootstrap.css').toString();

	const results = [];

	for (let i = 0; i < 1000; i++) {
		{
			const t = tokenizer(
				{
					css: source,
				},
				{
					onParseError: (err) => {
						throw new Error(JSON.stringify(err));
					},
				},
			);

			const start = performance.now();

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const token = t.nextToken();
				if (token[0] === TokenType.EOF) {
					break;
				}
			}

			const end = performance.now();
			results.push(end - start);
		}
	}

	results.sort((a, b) => {
		return a - b;
	});

	console.log('95th', results[949]);
	console.log('90th', results[899]);
	console.log('50th', results[499]);
	console.log('deviation', results[949] - results[49]);

	// Last results:
	// 95th 4.318916976451874
	// 90th 4.162833988666534
	// 50th 4.015332996845245
	// deviation 0.3882509469985962
}
