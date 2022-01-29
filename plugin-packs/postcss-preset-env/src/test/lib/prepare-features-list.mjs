import { prepareFeaturesList } from '../../lib/prepare-features-list.mjs';
import { strict as assert } from 'assert';
import { insertAfterKey, insertBeforeKey, insertOrderKey, pluginKey } from '../../own-keys/keys.mjs';

const fixedList = [
	{
		id: 'unknown',
		'should-exist-in-result': true,
	},
	{
		id: 'overflow-wrap-property',
		'should-exist-in-result': true,
	},
	{
		id: 'place-properties',
		'should-exist-in-result': true,
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
			'should-exist-in-result': true,
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
			'should-exist-in-result': true,
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
			'should-exist-in-result': true,
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
			'should-exist-in-result': true,
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
			'should-exist-in-result': true,
			[insertBeforeKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: 1,
		},
		fixedList[2],
		{
			id: 'place-properties',
			'should-exist-in-result': true,
			[insertAfterKey]: true,
			[insertOrderKey]: 0,
			[pluginKey]: 2,
		},
	],
);
