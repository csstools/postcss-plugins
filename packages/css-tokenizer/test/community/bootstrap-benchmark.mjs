import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import postcssTokenizer from 'postcss/lib/tokenize';
import fs from 'node:fs';

function logResults(label, tokenStreamLength, results) {
	console.log(`-------------- ${label} -------------`); // eslint-disable-line no-console
	console.log('tokens', tokenStreamLength); // eslint-disable-line no-console
	console.log('tokens/μs @ 95th', (tokenStreamLength / results[949]) / 1000); // eslint-disable-line no-console
	console.log('tokens/μs @ 50th', (tokenStreamLength / results[499]) / 1000); // eslint-disable-line no-console
	console.log('tokens/μs @ 5th ', (tokenStreamLength / results[49]) / 1000); // eslint-disable-line no-console
	console.log('-----------------------------------------------'); // eslint-disable-line no-console
	console.log('95th', results[949]); // eslint-disable-line no-console
	console.log('50th', results[499]); // eslint-disable-line no-console
	console.log('5th ', results[49]); // eslint-disable-line no-console
	console.log('deviation', results[949] - results[49]); // eslint-disable-line no-console
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
// tokens/μs @ 95th 2.1061912225704424
// tokens/μs @ 50th 10.319174466054184
// tokens/μs @ 5th  15.406664278064804
// -----------------------------------------------
// 95th 0.020416000000000878
// 50th 0.004166999999995369
// 5th  0.002790999999994881
// deviation 0.017625000000005997
// -------------- postcss tokenizer -------------
// tokens 24
// tokens/μs @ 95th 3.1307070180014045
// tokens/μs @ 50th 19.851116625262524
// tokens/μs @ 5th  20.58319039442491
// -----------------------------------------------
// 95th 0.007666000000000395
// 50th 0.0012090000000029022
// 5th  0.0011660000000048854
// deviation 0.006499999999995509
// -------------- csstools tokenizer -------------
// tokens 254
// tokens/μs @ 95th 3.831591015371639
// tokens/μs @ 50th 10.827400997483792
// tokens/μs @ 5th  11.837077080811484
// -----------------------------------------------
// 95th 0.06629099999999966
// 50th 0.02345900000000256
// 5th  0.021457999999995536
// deviation 0.04483300000000412
// -------------- postcss tokenizer -------------
// tokens 214
// tokens/μs @ 95th 9.528898388102103
// tokens/μs @ 50th 37.217391304400074
// tokens/μs @ 5th  38.62118751122371
// -----------------------------------------------
// 95th 0.02245800000000031
// 50th 0.005749999999991928
// 5th  0.005541000000008012
// deviation 0.0169169999999923
// -------------- csstools tokenizer -------------
// tokens 87709
// tokens/μs @ 95th 11.709887337610427
// tokens/μs @ 50th 12.304854096519708
// tokens/μs @ 5th  12.849881608623026
// -----------------------------------------------
// 95th 7.490165999999988
// 50th 7.128000000000611
// 5th  6.825665999999728
// deviation 0.6645000000002597
// -------------- postcss tokenizer -------------
// tokens 66238
// tokens/μs @ 95th 28.46141715840918
// tokens/μs @ 50th 35.05195773527393
// tokens/μs @ 5th  36.29811604679
// -----------------------------------------------
// 95th 2.3272909999996045
// 50th 1.8897090000009484
// 5th  1.8248329999996713
// deviation 0.5024579999999332
