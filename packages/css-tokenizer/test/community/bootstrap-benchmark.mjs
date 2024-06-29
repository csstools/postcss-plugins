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
// tokens/μs @ 95th 129.1941776504298
// tokens/μs @ 50th 172.09453435114503
// tokens/μs @ 5th  257.6501028571429
// -----------------------------------------------
// 95th 0.00033283233642578125
// 50th 0.0002498626708984375
// 5th  0.00016689300537109375
// deviation 0.0001659393310546875
// -------------- postcss tokenizer -------------
// tokens 24
// tokens/μs @ 95th 192.10552671755724
// tokens/μs @ 50th 192.10552671755724
// tokens/μs @ 5th  289.2623448275862
// -----------------------------------------------
// 95th 0.00012493133544921875
// 50th 0.00012493133544921875
// 5th  0.00008296966552734375
// deviation 0.000041961669921875
// -------------- csstools tokenizer -------------
// tokens 252
// tokens/μs @ 95th 2.715778269963052
// tokens/μs @ 50th 14.788099280857375
// tokens/μs @ 5th  17.58149985029442
// -----------------------------------------------
// 95th 0.09279108047485352
// 50th 0.017040729522705078
// 5th  0.014333248138427734
// deviation 0.07845783233642578
// -------------- postcss tokenizer -------------
// tokens 214
// tokens/μs @ 95th 6.8027424968168315
// tokens/μs @ 50th 7.901659031286864
// tokens/μs @ 5th  36.16653461197518
// -----------------------------------------------
// 95th 0.03145790100097656
// 50th 0.02708292007446289
// 5th  0.005917072296142578
// deviation 0.025540828704833984
// -------------- csstools tokenizer -------------
// tokens 87701
// tokens/μs @ 95th 10.659602521712898
// tokens/μs @ 50th 13.135529246644223
// tokens/μs @ 5th  13.474753513157573
// -----------------------------------------------
// 95th 8.227417469024658
// 50th 6.676624774932861
// 5th  6.508542060852051
// deviation 1.7188754081726074
// -------------- postcss tokenizer -------------
// tokens 66238
// tokens/μs @ 95th 18.231267325170737
// tokens/μs @ 50th 25.111551990929474
// tokens/μs @ 5th  26.735369993583255
// -----------------------------------------------
// 95th 3.633208751678467
// 50th 2.6377501487731934
// 5th  2.477541923522949
// deviation 1.1556668281555176
