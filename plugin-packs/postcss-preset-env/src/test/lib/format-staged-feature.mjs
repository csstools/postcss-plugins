import browserslist from 'browserslist';
import { formatStagedFeature } from '../../lib/format-feature.mjs';
import { strict as assert } from 'assert';
import { newTestLogger } from '../log/test-logger.mjs';

const testLogger = newTestLogger();

assert.deepStrictEqual(
	formatStagedFeature(
		[],
		browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
		{},
		{
			id: 'any-link-pseudo-class',
			plugin: true,
			browsers: [
				'ie >= 1',
			],
			vendors_implementations: 1,
		},
		undefined,
		undefined,
		testLogger.logger,
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
			enableProgressiveCustomProperties: false,
		},
		id: 'any-link-pseudo-class',
	},
);

assert.deepStrictEqual(
	formatStagedFeature(
		[],
		browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
		{
			'any-link-pseudo-class': true,
		},
		{
			id: 'any-link-pseudo-class',
			plugin: true,
			browsers: [
				'ie >= 1',
			],
			vendors_implementations: 1,
		},
		undefined,
		undefined,
		testLogger.logger,
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
			enableProgressiveCustomProperties: false,
		},
		id: 'any-link-pseudo-class',
	},
);

assert.deepStrictEqual(
	formatStagedFeature(
		[],
		browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
		{
			'any-link-pseudo-class': true,
		},
		{
			id: 'any-link-pseudo-class',
			plugin: true,
			browsers: [
				'ie >= 1',
			],
			vendors_implementations: 1,
		},
		{
			shared: true,
		},
		undefined,
		testLogger.logger,
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
			enableProgressiveCustomProperties: false,
			shared: true,
		},
		id: 'any-link-pseudo-class',
	},
);

assert.deepStrictEqual(
	formatStagedFeature(
		[],
		browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
		{},
		{
			id: 'any-link-pseudo-class',
			plugin: true,
			browsers: [
				'ie >= 1',
			],
			vendors_implementations: 1,
		},
		{
			shared: true,
		},
		undefined,
		testLogger.logger,
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
			enableProgressiveCustomProperties: false,
			shared: true,
		},
		id: 'any-link-pseudo-class',
	},
);

// Logical does not get passed to a non-logical plugin
assert.deepStrictEqual(
	formatStagedFeature(
		[],
		browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
		{},
		{
			id: 'any-link-pseudo-class',
			plugin: true,
			browsers: [
				'ie >= 1',
			],
			vendors_implementations: 1,
		},
		{
			shared: true,
		},
		{
			logical: {
				inlineDirection: 'right-to-left',
			},
		},
		testLogger.logger,
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
			enableProgressiveCustomProperties: false,
			shared: true,
		},
		id: 'any-link-pseudo-class',
	},
);


{
// Logical gets passed to a logical plugin
	const logicalPlugins = [
		'logical-properties-and-values',
		'float-clear-logical-values',
		'logical-resize',
		'logical-viewport-units',
	];

	for (const plugin of logicalPlugins) {
		assert.deepStrictEqual(
			formatStagedFeature(
				[],
				browserslist(['ie >= 1'], { ignoreUnknownVersions: true }),
				{},
				{
					id: plugin,
					plugin: true,
					browsers: [
						'ie >= 1',
					],
					vendors_implementations: 1,
				},
				{
					shared: true,
				},
				{
					logical: {
						inlineDirection: 'right-to-left',
					},
				},
				testLogger.logger,
			),
			{
				browsers: [
					'ie >= 1',
				],
				vendors_implementations: 1,
				plugin: true,
				pluginOptions: {
					enableProgressiveCustomProperties: false,
					shared: true,
					inlineDirection: 'right-to-left',
				},
				id: plugin,
			},
		);
	}
}
