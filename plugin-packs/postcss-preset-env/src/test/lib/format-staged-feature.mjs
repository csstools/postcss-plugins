import { formatStagedFeature } from '../../lib/format-feature.mjs';
import { strict as assert } from 'assert';
import { newTestLogger } from '../log/test-logger.mjs';

const testLogger = newTestLogger();

assert.deepStrictEqual(
	formatStagedFeature(
		[],
		['ie >= 1'],
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
		['ie >= 1'],
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
		['ie >= 1'],
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
		['ie >= 1'],
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
