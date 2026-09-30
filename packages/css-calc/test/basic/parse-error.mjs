import { calc, ParseErrorMessage } from '@csstools/css-calc';
import assert from 'node:assert';
import test from 'node:test';

test('calc(2px + 2)', () => {
	let parseErrors = [];

	calc('calc(2px + 2)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 5,
				end: 11,
			},
		],
	);
});

test('calc(2 + 2px)', () => {
	let parseErrors = [];

	calc('calc(2 + 2px)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 5,
				end: 11,
			},
		],
	);
});

test('calc(2px - 2)', () => {
	let parseErrors = [];

	calc('calc(2px - 2)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedSubtractionOfDimensionOrPercentageWithNumber,
				start: 5,
				end: 11,
			},
		],
	);
});

test('calc(2% + 2)', () => {
	let parseErrors = [];

	calc('calc(2% + 2)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 5,
				end: 10,
			},
		],
	);
});

test('calc(0.3 * 10px + 1px)', () => {
	let parseErrors = [];

	calc('calc(0.3 * 10px + 1px)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[],
	);
});

test('calc((2%) + (2))', () => {
	let parseErrors = [];

	calc('calc((2%) + (2))', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 6,
				end: 13,
			},
		],
	);
});

test('min(1px + 1, 2px)', () => {
	let parseErrors = [];

	calc('min(1px + 1, 2px)', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 4,
				end: 10,
			},
		],
	);
});

test('calc(2px + var(--foo))', () => {
	let parseErrors = [];

	calc('calc(2px + var(--foo))', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[],
	);
});

test('calc(2 + (2px + 3px))', () => {
	let parseErrors = [];

	calc('calc(2 + (2px + 3px))', {
		onParseError: (err) => {
			parseErrors.push({
				message: err.message,
				start: err.sourceStart,
				end: err.sourceEnd,
			});
		},
	});

	assert.deepStrictEqual(
		parseErrors,
		[
			{
				message: ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
				start: 5,
				end: 18,
			},
		],
	);
});
