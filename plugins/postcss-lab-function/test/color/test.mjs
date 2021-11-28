// !Important :
// We can't unit test this in a vacuum.
// ColorAid is a python package that follows the CSS specification.
// Comparing our output to the python package gives a relatively good idea of how good we convert.
import fs from 'fs';
import { labToSRgb, lchToSRgb } from '../../dist/index.mjs';

// LAB to SRGB
{
	// Small tolerance when in gamut.
	const corpus_in_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lab-in-gamut.json', 'utf8'));
	corpus_in_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = labToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs(a[0] - b[0]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[1] - b[1]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[2] - b[2]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		}
	});

	// Larger tolerance when out of gamut.
	// Currently browsers clip, but this behavior will be specified in the future.
	const corpus_out_of_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lab-out-of-gamut.json', 'utf8'));
	corpus_out_of_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = labToSRgb(testCase[0]).map(x => Math.max(Math.min(x, 100), 0));
		const b = testCase[1];

		if (Math.abs(a[0] - b[0]) > 0.8) {
			console.error(`inaccurate out of gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[1] - b[1]) > 0.8) {
			console.error(`inaccurate out of gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[2] - b[2]) > 0.8) {
			console.error(`inaccurate out of gamut conversion : lab(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		}
	});
}

// LCH to SRGB
{
	// Small tolerance when in gamut.
	const corpus_in_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lch-in-gamut.json', 'utf8'));
	corpus_in_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = lchToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs(a[0] - b[0]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[1] - b[1]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[2] - b[2]) > 0.4) {
			console.error(`inaccurate in gamut conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		}
	});

	// Larger tolerance when out of gamut.
	// Currently browsers clip, but this behavior will be specified in the future.
	const corpus_out_of_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lch-out-of-gamut.json', 'utf8'));
	corpus_out_of_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = lchToSRgb(testCase[0]).map(x => Math.max(Math.min(x, 100), 0));
		const b = testCase[1];

		if (Math.abs(a[0] - b[0]) > 0.8) {
			console.error(`inaccurate out of conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[1] - b[1]) > 0.8) {
			console.error(`inaccurate out of conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		} else if (Math.abs(a[2] - b[2]) > 0.8) {
			console.error(`inaccurate out of conversion : lch(${testCase[0][0]}% ${testCase[0][1]} ${testCase[0][2]})`, a, b);
			process.exit(1);
		}
	});
}
