import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import postcssTokenizer from 'postcss/lib/tokenize';
import fs from 'node:fs';

function logResults(label, tokenStreamLength, results) {
	console.log(`-------------- ${label} -------------`);
	console.log('tokens', tokenStreamLength);
	console.log('tokens/μs @ 95th', (tokenStreamLength / results[949]) / 1000);
	console.log('tokens/μs @ 50th', (tokenStreamLength / results[499]) / 1000);
	console.log('tokens/μs @ 5th ', (tokenStreamLength / results[49]) / 1000);
	console.log('-----------------------------------------------');
	console.log('95th', results[949]);
	console.log('50th', results[499]);
	console.log('5th ', results[49]);
	console.log('deviation', results[949] - results[49]);
}

const bootstrapSource = fs.readFileSync('./test/community/bootstrap.css').toString();
const openPropsSource = fs.readFileSync('./test/community/open-props.css').toString();

const tinySources = [
	'.foo',
	'10px',
	'-1276430.01',
	'#bar',
	'{ color: rgb(0, 0, 0) }',
	'@media (min-width: 300px) {}',
	'calc(10 + 2)',
	'var(--foo)',
	'--bar',
];

const smallSource = `
/* a comment */
<!-- CDO -->

-->
/* more comments */

.foo {
	image: url(https://example.com/foo.jpg);
	image: url("https://example.com/foo.jpg");
}

.foo {
	image: url(();
}

.foo {
	content: "foo
bar";
}

#1 {}

#foo {
	width: c\\61 lc(10% * 10px);
}

.fooz\\{\\} {}

.foo {
	margin: 0;
	margin: 1px;
	line-height: 1%;
	line-height: 1.2;
}

@media (min-width: 768px) and (max-width: 991px) {
	.visible-sm {
		display: block !important;
	}

	table.visible-sm {
		display: table !important;
	}

	tr.visible-sm {
		display: table-row !important;
	}

	th.visible-sm,
	td.visible-sm {
		display: table-cell !important;
	}
}

@media (min-width: 768px) and (max-width: 991px) {
	.visible-sm-block {
		display: block !important;
	}
}
`;

const largeSource = `
${smallSource}
${bootstrapSource}
${openPropsSource}
`;

function csstoolsLargeSource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		{
			const start = performance.now();

			const t = tokenizer(
				{
					css: largeSource,
				},
				{
					onParseError: () => {
						// noop
					},
				},
			);

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

	logResults('csstools tokenizer', tokenStreamLength, results);
}

function csstoolsSmallSource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		{
			const start = performance.now();

			const t = tokenizer(
				{
					css: smallSource,
				},
				{
					onParseError: () => {
						// noop
					},
				},
			);

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

	logResults('csstools tokenizer', tokenStreamLength, results);
}

function csstoolsTinySource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		const start = performance.now();

		for (let j = 0; j < tinySources.length; j++) {
			const source = tinySources[j];

			const t = tokenizer(
				{
					css: source,
				},
				{
					onParseError: () => {
						// noop
					},
				},
			);

			while (true) {
				const token = t.nextToken();
				if (token[0] === TokenType.EOF) {
					break;
				}

				tokenStreamLength++;
			}
		}

		const end = performance.now();
		results.push(end - start);
	}

	results.sort((a, b) => {
		return a - b;
	});

	logResults('csstools tokenizer', tokenStreamLength, results);
}

function postcssLargeSource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;
		{
			const start = performance.now();

			const t = postcssTokenizer(
				{
					css: largeSource,
				},
			);

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

	logResults('postcss tokenizer', tokenStreamLength, results);
}

function postcssSmallSource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;
		{
			const start = performance.now();

			const t = postcssTokenizer(
				{
					css: smallSource,
				},
			);

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

	logResults('postcss tokenizer', tokenStreamLength, results);
}

function postcssTinySource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		const start = performance.now();

		for (let j = 0; j < tinySources.length; j++) {
			const source = tinySources[j];

			const t = postcssTokenizer(
				{
					css: source,
				},
			);

			while (true) {
				const token = t.nextToken();
				if (!token) {
					break;
				}

				tokenStreamLength++;
			}
		}

		const end = performance.now();
		results.push(end - start);
	}

	results.sort((a, b) => {
		return a - b;
	});

	logResults('postcss tokenizer', tokenStreamLength, results);
}

await new Promise((resolve) => setTimeout(resolve(), 100));
csstoolsTinySource();
await new Promise((resolve) => setTimeout(resolve(), 1000));
postcssTinySource();
await new Promise((resolve) => setTimeout(resolve(), 1000));
csstoolsSmallSource();
await new Promise((resolve) => setTimeout(resolve(), 1000));
postcssSmallSource();
await new Promise((resolve) => setTimeout(resolve(), 1000));
csstoolsLargeSource();
await new Promise((resolve) => setTimeout(resolve(), 1000));
postcssLargeSource();

// Last result:
// -------------- csstools tokenizer -------------
// tokens 43
// tokens/μs @ 95th 2.224176278900998
// tokens/μs @ 50th 9.92384029540142
// tokens/μs @ 5th  11.862068965518729
// -----------------------------------------------
// 95th 0.019333000000003153
// 50th 0.004333000000002585
// 5th  0.0036249999999995453
// deviation 0.015708000000003608
// -------------- postcss tokenizer -------------
// tokens 24
// tokens/μs @ 95th 4.500281267579009
// tokens/μs @ 50th 16.937191249075372
// tokens/μs @ 5th  17.454545454597408
// -----------------------------------------------
// 95th 0.005333000000000254
// 50th 0.0014170000000035543
// 5th  0.0013749999999959073
// deviation 0.003958000000004347
// -------------- csstools tokenizer -------------
// tokens 254
// tokens/μs @ 95th 4.452859296657837
// tokens/μs @ 50th 8.7333241644877
// tokens/μs @ 5th  9.600120946403736
// -----------------------------------------------
// 95th 0.05704200000000981
// 50th 0.02908400000000455
// 5th  0.0264580000000052
// deviation 0.030584000000004608
// -------------- postcss tokenizer -------------
// tokens 214
// tokens/μs @ 95th 8.588858564776066
// tokens/μs @ 50th 33.354114713209
// tokens/μs @ 5th  36.42553191496199
// -----------------------------------------------
// 95th 0.0249160000000046
// 50th 0.006416000000001532
// 5th  0.005874999999988972
// deviation 0.01904100000001563
// -------------- csstools tokenizer -------------
// tokens 87709
// tokens/μs @ 95th 9.569123769860967
// tokens/μs @ 50th 9.760582022651974
// tokens/μs @ 5th  9.936257012018164
// -----------------------------------------------
// 95th 9.165834000000018
// 50th 8.986042000000452
// 5th  8.827166999999463
// deviation 0.33866700000055516
// -------------- postcss tokenizer -------------
// tokens 66238
// tokens/μs @ 95th 23.904005774083252
// tokens/μs @ 50th 30.075140175537726
// tokens/μs @ 5th  30.758300441137337
// -----------------------------------------------
// 95th 2.7710000000006403
// 50th 2.2024170000004233
// 5th  2.1535000000003492
// deviation 0.617500000000291
