import { prepareFeaturesList } from '../../lib/prepare-features-list.mjs';
import { strict as assert } from 'assert';
import { insertAfterKey, insertBeforeKey, insertOrderKey, pluginKey } from '../../own-keys/keys.mjs';

const fixedList = [
	{
		id: 'unknown',
		'should-not-exist-in-result': true,
	},
	{
		id: 'overflow-wrap-property',
		'should-not-exist-in-result': true,
	},
	{
		id: 'place-properties',
		'should-not-exist-in-result': true,
	},
];

assert.deepStrictEqual(
	prepareFeaturesList(fixedList),
	[
		fixedList[1],
		fixedList[2],
	],
);

assert.deepStrictEqual(
	prepareFeaturesList(
		fixedList,
		{
			'place-properties': true,
		},
	),
	[
		fixedList[1],
		{
			id: 'place-properties',
			[insertBeforeKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: true,
		},
		fixedList[2],
	],
);

assert.deepStrictEqual(
	prepareFeaturesList(
		fixedList,
		undefined,
		{
			'place-properties': true,
		},
	),
	[
		fixedList[1],
		fixedList[2],
		{
			id: 'place-properties',
			[insertAfterKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: true,
		},
	],
);

assert.deepStrictEqual(
	prepareFeaturesList(
		fixedList,
		{
			'unknown': true,
		},
	),
	[
		{
			id: 'unknown',
			[insertBeforeKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: true,
		},
		fixedList[1],
		fixedList[2],
	],
);

assert.deepStrictEqual(
	prepareFeaturesList(
		fixedList,
		undefined,
		{
			'unknown': true,
		},
	),
	[
		{
			id: 'unknown',
			[insertAfterKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: true,
		},
		fixedList[1],
		fixedList[2],
	],
);

assert.deepStrictEqual(
	prepareFeaturesList(
		fixedList,
		{
			'place-properties': 1,
		},
		{
			'place-properties': 2,
		},
	),
	[
		fixedList[1],
		{
			id: 'place-properties',
			[insertBeforeKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: 1,
		},
		fixedList[2],
		{
			id: 'place-properties',
			[insertAfterKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: 2,
		},
	],
);
