import { newTestLogger } from '../../log/test-logger.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { listFeatures } from '../../../lib/list-features.mjs';
import { cssdb }  from './cssdb-fixture.mjs';

test('array options [false, ...] - A', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			features: {
				'any-link-pseudo-class': [false, { subFeatures: { areaHrefNeedsFixing: false } }],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'any-link-pseudo-class\' disabled manually',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
			],
		],
	);
});

test('array options [false, ...] - B', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			features: {
				'any-link-pseudo-class': [false, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'any-link-pseudo-class\' disabled manually',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
			],
		],
	);
});

test('array options [true, ...] - A', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			features: {
				'any-link-pseudo-class': [true, { subFeatures: { areaHrefNeedsFixing: false } }],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: [
					'and_chr < 18', 'and_ff < 4',
					'android < 65', 'chrome < 1',
					'edge < 79', 'firefox < 1',
					'ie >= 1', 'ios_saf < 1',
					'op_mini all', 'op_mob < 14',
					'opera < 15', 'safari < 3',
					'samsung < 1.0',
				],
				vendors_implementations: 3,
				pluginOptions: {
					subFeatures: {
						areaHrefNeedsFixing: false,
					},
					enableProgressiveCustomProperties: false,
				},
				id: 'any-link-pseudo-class',
			},
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
			],
		],
	);
});

test('array options [true, ...] - B', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			features: {
				'any-link-pseudo-class': [true, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: [
					'and_chr < 18', 'and_ff < 4',
					'android < 65', 'chrome < 1',
					'edge < 79', 'firefox < 1',
					'ie >= 1', 'ios_saf < 1',
					'op_mini all', 'op_mob < 14',
					'opera < 15', 'safari < 3',
					'samsung < 1.0',
				],
				vendors_implementations: 3,
				pluginOptions: {
					subFeatures: {
						areaHrefNeedsFixing: true,
					},
					enableProgressiveCustomProperties: false,
				},
				id: 'any-link-pseudo-class',
			},
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
			],
		],
	);
});

test('array options [true, ...] - C', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			features: {
				'any-link-pseudo-class': [true, {}],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: [
					'and_chr < 18', 'and_ff < 4',
					'android < 65', 'chrome < 1',
					'edge < 79', 'firefox < 1',
					'ie >= 1', 'ios_saf < 1',
					'op_mini all', 'op_mob < 14',
					'opera < 15', 'safari < 3',
					'samsung < 1.0',
				],
				vendors_implementations: 3,
				pluginOptions: {
					enableProgressiveCustomProperties: false,
				},
				id: 'any-link-pseudo-class',
			},
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
			],
		],
	);
});

test('array options - enabled (edge 18)', () => {
	const testLogger = newTestLogger();

	const testCases = [
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': ['auto', { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		},
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': [true, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		},
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': true,
			},
		},
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': { subFeatures: { areaHrefNeedsFixing: true } },
			},
		},
	];

	for (const testCaseOptions of testCases) {
		testLogger.logger.resetLogger();

		assert.deepStrictEqual(
			cleanResult(listFeatures(cssdb, testCaseOptions, undefined, testLogger.logger)),
			[
				{
					browsers: [
						'and_chr < 18', 'and_ff < 4',
						'android < 65', 'chrome < 1',
						'edge < 79', 'firefox < 1',
						'ie >= 1', 'ios_saf < 1',
						'op_mini all', 'op_mob < 14',
						'opera < 15', 'safari < 3',
						'samsung < 1.0',
					],
					vendors_implementations: 3,
					pluginOptions: {
						subFeatures: {
							areaHrefNeedsFixing: true,
						},
						enableProgressiveCustomProperties: false,
					},
					id: 'any-link-pseudo-class',
				},
				{
					browsers: ['> 0%'],
					vendors_implementations: undefined,
					pluginOptions: {},
					id: 'progressive-custom-properties',
				},
			],
		);
	}
});

test('array options - enabled (edge 80)', () => {
	const testLogger = newTestLogger();

	const testCases = [
		{
			browsers: ['edge 80'],
			features: {
				'any-link-pseudo-class': [true, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		},
		{
			browsers: ['edge 80'],
			features: {
				'any-link-pseudo-class': { subFeatures: { areaHrefNeedsFixing: true } },
			},
		},
	];

	for (const testCaseOptions of testCases) {
		testLogger.logger.resetLogger();

		assert.deepStrictEqual(
			cleanResult(listFeatures(cssdb, testCaseOptions, undefined, testLogger.logger)),
			[
				{
					browsers: [
						'and_chr < 18', 'and_ff < 4',
						'android < 65', 'chrome < 1',
						'edge < 79', 'firefox < 1',
						'ie >= 1', 'ios_saf < 1',
						'op_mini all', 'op_mob < 14',
						'opera < 15', 'safari < 3',
						'samsung < 1.0',
					],
					vendors_implementations: 3,
					pluginOptions: {
						subFeatures: {
							areaHrefNeedsFixing: true,
						},
						enableProgressiveCustomProperties: false,
					},
					id: 'any-link-pseudo-class',
				},
				{
					browsers: ['> 0%'],
					vendors_implementations: undefined,
					pluginOptions: {},
					id: 'progressive-custom-properties',
				},
			],
		);
	}
});

test('array options - disabled', () => {
	const testLogger = newTestLogger();

	const testCases = [
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': [false, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		},
		{
			browsers: ['edge 80'],
			features: {
				'any-link-pseudo-class': [false, { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		},
		{
			browsers: ['edge 18'],
			features: {
				'any-link-pseudo-class': false,
			},
		},
		{
			browsers: ['edge 80'],
			features: {
				'any-link-pseudo-class': false,
			},
		},
	];

	for (const testCaseOptions of testCases) {
		testLogger.logger.resetLogger();

		assert.deepStrictEqual(
			cleanResult(listFeatures(cssdb, testCaseOptions, undefined, testLogger.logger)),
			[
				{
					browsers: ['> 0%'],
					vendors_implementations: undefined,
					pluginOptions: {},
					id: 'progressive-custom-properties',
				},
			],
		);

		testLogger.logger.emitLogs(testLogger);
		assert.deepStrictEqual(
			testLogger.getLogs().map(x => x.split('\n')),
			[
				[
					'Using features from Stage 2 (default).',
					'- \'any-link-pseudo-class\' disabled manually',
					'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
				],
			],
		);
	}
});

test('array options - disabled - B', () => {
	const testLogger = newTestLogger();
	testLogger.logger.resetLogger();

	assert.deepStrictEqual(
		cleanResult(listFeatures(cssdb, {
			browsers: ['edge 80'],
			features: {
				'any-link-pseudo-class': ['auto', { subFeatures: { areaHrefNeedsFixing: true } }],
			},
		}, undefined, testLogger.logger)),
		[
			{
				browsers: ['> 0%'],
				vendors_implementations: undefined,
				pluginOptions: {},
				id: 'progressive-custom-properties',
			},
		],
	);

	testLogger.logger.emitLogs(testLogger);
	assert.deepStrictEqual(
		testLogger.getLogs().map(x => x.split('\n')),
		[
			[
				'Using features from Stage 2 (default).',
				'- \'blank-pseudo-class\' disabled because it lacks the required stage (1 out of 2).',
				'- \'any-link-pseudo-class\' disabled because all targeted browsers support it.',
			],
		],
	);
});

function cleanResult(res) {
	return res.map((x) => {
		if (!x.plugin) {
			throw new Error(`feature "${x.id}" must have a plugin`);
		}
		delete x.plugin;
		return x;
	});
}
