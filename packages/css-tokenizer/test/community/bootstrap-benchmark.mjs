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
// tokens/μs @ 95th 2.445543991355516
// tokens/μs @ 50th 7.818181818179839
// tokens/μs @ 5th  9.213627598019114
// -----------------------------------------------
// 95th 0.01758299999999835
// 50th 0.005500000000001393
// 5th  0.004667000000004862
// deviation 0.012915999999993488
// -------------- postcss tokenizer -------------
// tokens 24
// tokens/μs @ 95th 4.721621089901807
// tokens/μs @ 50th 16.937191249075372
// tokens/μs @ 5th  17.454545454597408
// -----------------------------------------------
// 95th 0.005083000000006166
// 50th 0.0014170000000035543
// 5th  0.0013749999999959073
// deviation 0.0037080000000102586
// -------------- csstools tokenizer -------------
// tokens 254
// tokens/μs @ 95th 3.4577581747392014
// tokens/μs @ 50th 8.09561752988124
// tokens/μs @ 5th  8.514061609627937
// -----------------------------------------------
// 95th 0.07345800000000224
// 50th 0.031374999999997044
// 5th  0.029832999999996446
// deviation 0.0436250000000058
// -------------- postcss tokenizer -------------
// tokens 214
// tokens/μs @ 95th 8.503198633131982
// tokens/μs @ 50th 33.56862745102589
// tokens/μs @ 5th  34.4716494845312
// -----------------------------------------------
// 95th 0.025166999999996165
// 50th 0.00637499999999136
// 5th  0.0062080000000008795
// deviation 0.018958999999995285
// -------------- csstools tokenizer -------------
// tokens 87709
// tokens/μs @ 95th 6.563939456304076
// tokens/μs @ 50th 8.16464186638891
// tokens/μs @ 5th  8.251178870870593
// -----------------------------------------------
// 95th 13.362250000000131
// 50th 10.742541000000074
// 5th  10.629875000000538
// deviation 2.7323749999995925
// -------------- postcss tokenizer -------------
// tokens 66238
// tokens/μs @ 95th 15.56191875982649
// tokens/μs @ 50th 27.895556959361063
// tokens/μs @ 5th  30.688828400983496
// -----------------------------------------------
// 95th 4.256415999998353
// 50th 2.374499999999898
// 5th  2.1583750000008877
// deviation 2.0980409999974654
