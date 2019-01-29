'use strict';

// convert module
const convert = require('.');

// test a range of colors in a given color space
function test(opts) {
	const from = opts.from;
	const to = opts.to;
	const channel1 = opts.channel1;
	const channel2 = opts.channel2;
	const channel3 = opts.channel3;

	console.log('Test:', opts.from, '=>', opts.to);

	for (let channel1value = channel1.start; channel1value <= channel1.stop; channel1value += channel1.increment) {
		for (let channel2value = channel2.start; channel2value <= channel2.stop; channel2value += channel2.increment) {
			for (let channel3value = channel3.start; channel3value <= channel3.stop; channel3value += channel3.increment) {
				// the source color in the original color space
				const source1 = [channel1value, channel2value, channel3value];

				// the source color in the converted color space
				const source2 = convert[`${from}2${to}`](source1[0], source1[1], source1[2]);

				// the resulting color converted back to its original color space
				const result1 = convert[`${to}2${from}`](source2[0], source2[1], source2[2], channel1value);

				// the resulting color converted back to its converted color space
				const result2 = convert[`${from}2${to}`](result1[0], result1[1], result1[2]);

				if (
					// if the source color has changed
					source1.map(Math.round).join() !== result1.map(Math.round).join() &&
					// and the converted color has also changed
					source2.map(Math.round).join() !== result2.map(Math.round).join()
				) {
					// log the failing color conversion
					console.log({ [from]: source1, [to]: source2, 'became': result1 });

					// exit with failure
					process.exit(1);
				}
			}
		}
	}
}

function testExpression(text, result, expect, precession) {
	if (typeof result === 'number') {
		const multiplier = Math.pow(10, precession || 0);
		const normalizedResult = Math.round(result * multiplier) / multiplier;
		const normalizedExpect = Math.round(expect * multiplier) / multiplier;

		console.log(`Test: ${text} is ${normalizedExpect}`);

		if (normalizedResult !== normalizedExpect) {
			console.log({ expect: normalizedExpect, result: normalizedResult });

			process.exit(1);
		}
	} else {
		console.log(`Test: ${text} is ${expect}`);

		if (result !== expect) {
			console.log({ expect, result });

			process.exit(1);
		}
	}
}

// test RGB to HSL conversion
test({
	from: 'rgb', to: 'hsl',
	channel1: { start: 0, stop: 100, increment: 4 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test RGB to HWB conversion
test({
	from: 'rgb', to: 'hwb',
	channel1: { start: 0, stop: 100, increment: 4 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test RGB to Lab conversion
test({
	from: 'rgb', to: 'lab',
	channel1: { start: 0, stop: 100, increment: 4 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test RGB to LCH conversion
test({
	from: 'rgb', to: 'lch',
	channel1: { start: 0, stop: 100, increment: 4 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test HSL to RGB conversion
test({
	from: 'hsl', to: 'rgb',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test HSL to HWB conversion
test({
	from: 'hsl', to: 'hwb',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test HSL to Lab conversion
test({
	from: 'hsl', to: 'lab',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test HSL to LCH conversion
test({
	from: 'hsl', to: 'lch',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
});

// test HWB to RGB conversion
test({
	from: 'hwb', to: 'rgb',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
}, 10);

// test HWB to HSL conversion
test({
	from: 'hwb', to: 'hsl',
	channel1: { start: 0, stop: 359, increment: 1 },
	channel2: { start: 0, stop: 100, increment: 4 },
	channel3: { start: 0, stop: 100, increment: 4 }
}, 10);

testExpression(
	'rgb(100% 100% 100%) / rgb(0% 0% 0%) contrast',
	convert.rgb2contrast([100, 100, 100], [0, 0, 0]),
	21
);
testExpression(
	'rgb(100% 100% 100%) / rgb(50% 50% 50%) contrast',
	convert.rgb2contrast([100, 100, 100], [50, 50, 50]),
	3.98, 2
);
testExpression(
	'rgb(100% 100% 100%) / rgb(100% 0% 0%) contrast',
	convert.rgb2contrast([100, 100, 100], [100, 0, 0]),
	4, 2
);
testExpression(
	'contrast rgb(97.647% 97.647% 97.647%) / rgb(100% 0% 0%)',
	convert.rgb2contrast([97.647, 97.647, 97.647], [100, 0, 0]),
	3.8, 2
);
testExpression(
	'rgb2ciede matches lab2ciede',
	convert.rgb2ciede([100, 100, 100], [0, 0, 0]),
	convert.lab2ciede(convert.rgb2lab(100, 100, 100), convert.rgb2lab(0, 0, 0))
);
testExpression(
	'rgb2ciede rgb(50% 50% 50%) / rgb(0% 0% 0%)',
	convert.rgb2ciede([50, 50, 50], [0, 0, 0]),
	40
);

// exit with success
process.exit(0);
