import assert from 'assert';
import { newMediaFeatureBoolean, newMediaFeaturePlain, parse } from '@csstools/media-query-list-parser';
import { TokenType } from '@csstools/css-tokenizer';

{
	const feature = newMediaFeaturePlain('min-width', [TokenType.Dimension, '300px', 0, 0, { value: 300, unit: 'px' }]);
	assert.strictEqual(
		feature.getName(),
		'min-width',
	);

	assert.deepStrictEqual(
		feature.getNameToken(),
		['ident-token', 'min-width', -1, -1, { value: 'min-width' }],
	);

	assert.strictEqual(
		feature.feature.getName(),
		'min-width',
	);

	assert.deepStrictEqual(
		feature.feature.getNameToken(),
		['ident-token', 'min-width', -1, -1, { value: 'min-width' }],
	);

	assert.strictEqual(
		feature.feature.name.getName(),
		'min-width',
	);

	assert.deepStrictEqual(
		feature.feature.name.getNameToken(),
		['ident-token', 'min-width', -1, -1, { value: 'min-width' }],
	);
}

{
	const feature = newMediaFeaturePlain('min width', [TokenType.Dimension, '300px', 0, 0, { value: 300, unit: 'px' }]);
	assert.strictEqual(
		feature.getName(),
		'min width',
	);

	assert.deepStrictEqual(
		feature.getNameToken(),
		['ident-token', 'min\\20width', -1, -1, { value: 'min width' }],
	);
}

{
	const feature = newMediaFeatureBoolean('width');
	assert.strictEqual(
		feature.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.getNameToken(),
		['ident-token', 'width', -1, -1, { value: 'width' }],
	);

	assert.strictEqual(
		feature.feature.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.feature.getNameToken(),
		['ident-token', 'width', -1, -1, { value: 'width' }],
	);

	assert.strictEqual(
		feature.feature.name.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.feature.name.getNameToken(),
		['ident-token', 'width', -1, -1, { value: 'width' }],
	);
}

{
	const feature = newMediaFeatureBoolean('w dth');
	assert.strictEqual(
		feature.getName(),
		'w dth',
	);

	assert.deepStrictEqual(
		feature.getNameToken(),
		['ident-token', 'w\\20 dth', -1, -1, { value: 'w dth' }],
	);
}

{
	const queries = parse('(300px < width < 400px)');
	const feature = queries[0]?.media?.media?.media;

	assert.strictEqual(
		feature.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.getNameToken(),
		['ident-token', 'width', 9, 13, { value: 'width' }],
	);

	assert.strictEqual(
		feature.feature.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.feature.getNameToken(),
		['ident-token', 'width', 9, 13, { value: 'width' }],
	);

	assert.strictEqual(
		feature.feature.name.getName(),
		'width',
	);

	assert.deepStrictEqual(
		feature.feature.name.getNameToken(),
		['ident-token', 'width', 9, 13, { value: 'width' }],
	);
}
