import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import postcssTokenizer from 'postcss/lib/tokenize';
import fs from 'fs';

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

	logResults('csstools tokenizer', tokenStreamLength, results);
}

function csstoolsTinySource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		for (let j = 0; j < tinySources.length; j++) {
			const source = tinySources[j];

			const start = performance.now();

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

	logResults('postcss tokenizer', tokenStreamLength, results);
}

function postcssTinySource() {
	const results = [];
	let tokenStreamLength = 0;

	for (let i = 0; i < 1000; i++) {
		tokenStreamLength = 0;

		for (let j = 0; j < tinySources.length; j++) {
			const source = tinySources[j];

			const start = performance.now();

			const t = postcssTokenizer(
				{
					css: source,
				},
			);

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
// tokens/μs @ 95th 147.10854159869496
// tokens/μs @ 50th 171.76673523809524
// tokens/μs @ 5th  206.82921100917432
// -----------------------------------------------
// 95th 0.0002923011779785156
// 50th 0.0002503395080566406
// 5th  0.0002079010009765625
// deviation 0.00008440017700195312
// -------------- postcss tokenizer -------------
// tokens 24
// tokens/μs @ 95th 191.3750874524715
// tokens/μs @ 50th 192.10552671755724
// tokens/μs @ 5th  289.2623448275862
// -----------------------------------------------
// 95th 0.00012540817260742188
// 50th 0.00012493133544921875
// 5th  0.00008296966552734375
// deviation 0.000042438507080078125
// -------------- csstools tokenizer -------------
// tokens 252
// tokens/μs @ 95th 2.4858291423249512
// tokens/μs @ 50th 12.840642029302428
// tokens/μs @ 5th  15.468529313625055
// -----------------------------------------------
// 95th 0.10137462615966797
// 50th 0.019625186920166016
// 5th  0.016291141510009766
// deviation 0.0850834846496582
// -------------- postcss tokenizer -------------
// tokens 214
// tokens/μs @ 95th 3.203975983951225
// tokens/μs @ 50th 7.9627850463973315
// tokens/μs @ 5th  25.67745325552123
// -----------------------------------------------
// 95th 0.06679201126098633
// 50th 0.026875019073486328
// 5th  0.008334159851074219
// deviation 0.05845785140991211
// -------------- csstools tokenizer -------------
// tokens 87701
// tokens/μs @ 95th 9.514877130822835
// tokens/μs @ 50th 11.584315742427334
// tokens/μs @ 5th  11.894349579771065
// -----------------------------------------------
// 95th 9.217249870300293
// 50th 7.570667266845703
// 5th  7.373332977294922
// deviation 1.843916893005371
// -------------- postcss tokenizer -------------
// tokens 66238
// tokens/μs @ 95th 18.456481036392354
// tokens/μs @ 50th 25.63886291747939
// tokens/μs @ 5th  26.946553538250367
// -----------------------------------------------
// 95th 3.5888748168945312
// 50th 2.5834999084472656
// 5th  2.458125114440918
// deviation 1.1307497024536133
