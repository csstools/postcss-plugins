import { formatStagedFeature } from '../../lib/format-feature.mjs';
import { strict as assert } from 'assert';

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
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: { subFeatures: { areaHrefNeedsFixing: true } },
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
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: { subFeatures: { areaHrefNeedsFixing: true } },
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
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: { subFeatures: { areaHrefNeedsFixing: true }, shared: true },
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
	),
	{
		browsers: [
			'ie >= 1',
		],
		vendors_implementations: 1,
		plugin: true,
		pluginOptions: { subFeatures: { areaHrefNeedsFixing: true }, shared: true },
		id: 'any-link-pseudo-class',
	},
);
