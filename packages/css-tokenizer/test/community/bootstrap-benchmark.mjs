import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import postcssTokenizer from 'postcss/lib/tokenize';
import fs from 'fs';

{
	const source = fs.readFileSync('./test/community/bootstrap.css').toString();

	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

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

				tokenStreamLength++;
			}

			const end = performance.now();
			results.push(end - start);
		}
	}

	results.sort((a, b) => {
		return a - b;
	});

	console.log('-------------- csstools tokenizer -------------');
	console.log('tokens', tokenStreamLength);
	console.log('tokens/μs @ 95th', (tokenStreamLength / results[949]) / 1000);
	console.log('tokens/μs @ 50th', (tokenStreamLength / results[499]) / 1000);
	console.log('-----------------------------------------------');
	console.log('95th', results[949]);
	console.log('90th', results[899]);
	console.log('50th', results[499]);
	console.log('deviation', results[949] - results[49]);
}

{
	const source = fs.readFileSync('./test/community/bootstrap.css').toString();

	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;
		{
			const t = postcssTokenizer(
				{
					css: source,
				},
			);

			const start = performance.now();

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const token = t.nextToken();
				if (!token) {
					break;
				}

				tokenStreamLength++;
			}

			const end = performance.now();
			results.push(end - start);
		}
	}

	results.sort((a, b) => {
		return a - b;
	});

	console.log('-------------- postcss tokenizer -------------');
	console.log('tokens', tokenStreamLength);
	console.log('tokens/μs @ 95th', (tokenStreamLength / results[949]) / 1000);
	console.log('tokens/μs @ 50th', (tokenStreamLength / results[499]) / 1000);
	console.log('----------------------------------------------');
	console.log('95th', results[949]);
	console.log('90th', results[899]);
	console.log('50th', results[499]);
	console.log('deviation', results[949] - results[49]);
}

// Last result:
// -------------- csstools tokenizer -------------
// tokens 37088
// tokens/μs @ 95th 10.38213287435934
// tokens/μs @ 50th 11.020875148827852
// -----------------------------------------------
// 95th 3.5722910165786743
// 90th 3.4610829949378967
// 50th 3.365249991416931
// deviation 0.24970799684524536
// -------------- postcss tokenizer -------------
// tokens 27045
// tokens/μs @ 95th 18.530318414584258
// tokens/μs @ 50th 26.92161819321654
// ----------------------------------------------
// 95th 1.459500014781952
// 90th 1.2470839619636536
// 50th 1.0045830011367798
// deviation 0.4862080216407776
