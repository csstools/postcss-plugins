// convert module
const convert = require('.');

// tests
const tests = [
	{
		message: 'converts mango from rgb to hsl',
		source: convert.rgb2hsl(100, 50, 25),
		expect: [20, 100, 62.5]
	},
	{
		message: 'converts mango from rgb to hwb',
		source: convert.rgb2hwb(100, 50, 25),
		expect: [20, 25, 0]
	},
	{
		message: 'converts mango from hsl to rgb',
		source: convert.hsl2rgb(100, 50, 25),
		expect: [20.833333333333325, 37.5, 12.5]
	},
	{
		message: 'converts mango from hsl to hwb',
		source: convert.hsl2hwb(100, 50, 25),
		expect: [100, 12.500000000000005, 62.5]
	},
	{
		message: 'converts mango from hwb to rgb',
		source: convert.hwb2rgb(100, 50, 25),
		expect: [58.33333333333333, 75.00000000000001, 49.999999999999986]
	},
	{
		message: 'converts mango from hwb to hsl',
		source: convert.hwb2hsl(100, 50, 25),
		expect: [100, 33.33333333333334, 62.5]
	},
	{
		message: 'converts white from rgb to hsl',
		source: convert.rgb2hsl(100, 100, 100),
		expect: [ 0, 0, 100 ]
	},
	{
		message: 'converts white from rgb to hwb',
		source: convert.rgb2hwb(100, 100, 100),
		expect: [ 0, 100, 0 ]
	},
	{
		message: 'converts white from hsl to rgb',
		source: convert.hsl2rgb(0, 0, 100),
		expect: [ 100, 100, 100 ]
	},
	{
		message: 'converts white from hsl to hwb',
		source: convert.hsl2hwb(0, 0, 100),
		expect: [ 0, 100, 0 ]
	},
	{
		message: 'converts white from hwb to rgb',
		source: convert.hwb2rgb(0, 100, 0),
		expect: [ 100, 100, 100 ]
	},
	{
		message: 'converts white from hwb to hsl',
		source: convert.hwb2hsl(0, 100, 0),
		expect: [ 0, 0, 100 ]
	},
	{
		message: 'converts black from rgb to hsl',
		source: convert.rgb2hsl(0, 0, 0),
		expect: [ 0, 0, 0 ]
	},
	{
		message: 'converts black from rgb to hwb',
		source: convert.rgb2hwb(0, 0, 0),
		expect: [ 0, 0, 100 ]
	},
	{
		message: 'converts black from hsl to rgb',
		source: convert.hsl2rgb(0, 0, 0),
		expect: [ 0, 0, 0 ]
	},
	{
		message: 'converts black from hsl to hwb',
		source: convert.hsl2hwb(0, 0, 0),
		expect: [ 0, 0, 100 ]
	},
	{
		message: 'converts black from hwb to rgb',
		source: convert.hwb2rgb(0, 0, 100),
		expect: [ 0, 0, 0 ]
	},
	{
		message: 'converts black from hwb to hsl',
		source: convert.hwb2hsl(0, 0, 100),
		expect: [ 0, 0, 0 ]
	},
	{
		message: 'converts dark gray from rgb to hsl',
		source: convert.rgb2hsl(25, 25, 25),
		expect: [ 0, 0, 25 ]
	},
	{
		message: 'converts dark gray from rgb to hwb',
		source: convert.rgb2hwb(25, 25, 25),
		expect: [ 0, 25, 75 ]
	},
	{
		message: 'converts dark gray from hsl to rgb',
		source: convert.hsl2rgb(0, 0, 25),
		expect: [ 25, 25, 25 ]
	},
	{
		message: 'converts dark gray from hsl to hwb',
		source: convert.hsl2hwb(0, 0, 25),
		expect: [ 0, 25, 75 ]
	},
	{
		message: 'converts dark gray from hwb to rgb',
		source: convert.hwb2rgb(0, 25, 75),
		expect: [ 25, 25, 25 ]
	},
	{
		message: 'converts dark gray from hwb to hsl',
		source: convert.hwb2hsl(0, 25, 75),
		expect: [ 0, 0, 25 ]
	}
];

// symbols
const isWin32 = process.platform === 'win32';
const tick    = isWin32 ? '√' : '✔';
const cross   = isWin32 ? '×' : '✖';

tests.forEach(
	test => {
		const result = compare(test.source, test.expect);
		const resultSymbol = result ? tick : cross;
		const equalitySymbol = result ? '==' : '!=';

		console.log(`${resultSymbol} ${test.message}: [${test.expect.map(round)}] ${equalitySymbol} [${test.source.map(round)}]`);
	}
);

function compare(array1, array2) {
	return array1.every(
		(channel, index) => round(channel) === round(array2[index])
	);
}

function round(number) {
	return Math.round(number * 10000000000) / 10000000000
}
