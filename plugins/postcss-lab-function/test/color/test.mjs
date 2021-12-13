// !Important :
// We can't unit test this in a vacuum.
// ColorAid is a python package that follows the CSS specification.
// Comparing our output to the python package gives a relatively good idea of how good we convert.
import fs from 'fs';
import plugin from '../../dist/index.mjs';
const lchToSRgb = plugin._lchToSRgb;
const labToSRgb = plugin._labToSRgb;

// LAB to SRGB
{
	// Small tolerance when in gamut.
	const corpus_in_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lab-in-gamut--coloraide.json', 'utf8'));
	corpus_in_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = labToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs((a[0] * 255) - (b[0] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		} else if (Math.abs((a[1] * 255) - (b[1] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		} else if (Math.abs((a[2] * 255) - (b[2] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		}
	});

	// Larger tolerance when out of gamut.
	// Currently browsers clip, but this behavior will be specified in the future.
	const corpus_out_of_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lab-out-of-gamut--coloraide.json', 'utf8'));
	corpus_out_of_gamut.forEach((testCase, index) => {
		if (!testCase) {
			return;
		}

		const a = labToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs((a[0] * 255) - (b[0] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 3000) process.exit(1);
		} else if (Math.abs((a[1] * 255) - (b[1] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 3000) process.exit(1);
		} else if (Math.abs((a[2] * 255) - (b[2] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${labColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 3000) process.exit(1);
		} else {
			console.log('success!');
		}
	});
}

// LCH to SRGB
{
	// Small tolerance when in gamut.
	const corpus_in_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lch-in-gamut--coloraide.json', 'utf8'));
	corpus_in_gamut.forEach((testCase) => {
		if (!testCase) {
			return;
		}

		const a = lchToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs((a[0] * 255) - (b[0] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		} else if (Math.abs((a[1] * 255) - (b[1] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		} else if (Math.abs((a[2] * 255) - (b[2] * 255)) > 0.05) {
			console.error(`inaccurate in gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			process.exit(1);
		}
	});

	// Larger tolerance when out of gamut.
	// Currently browsers clip, but this behavior will be specified in the future.
	const corpus_out_of_gamut = JSON.parse(fs.readFileSync('./test/color/corpus-lch-out-of-gamut--coloraide.json', 'utf8'));
	corpus_out_of_gamut.forEach((testCase, index) => {
		if (!testCase) {
			return;
		}

		const a = lchToSRgb(testCase[0]);
		const b = testCase[1];

		if (Math.abs((a[0] * 255) - (b[0] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 5) process.exit(1);
		} else if (Math.abs((a[1] * 255) - (b[1] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 5) process.exit(1);
		} else if (Math.abs((a[2] * 255) - (b[2] * 255)) > 1) {
			console.error(`inaccurate out of gamut conversion : ${lchColorPretty(testCase[0])}`, rgbColorPretty(a), rgbColorPretty(b));
			if (index > 5) process.exit(1);
		}
	});
}

function rgbColorPretty(a) {
	return `rgb(${Math.round(a[0] * 255)}, ${Math.round(a[1] * 255)}, ${Math.round(a[2] * 255)})`;
}

function labColorPretty(a) {
	return `lab(${a[0]}% ${a[1]} ${a[2]})`;
}

function lchColorPretty(a) {
	return `lch(${a[0]}% ${a[1]} ${a[2]})`;
}
