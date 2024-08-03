import { parse } from '@csstools/cascade-layer-name-parser';
import assert from 'node:assert';

{
	const a = parse(' some-layer./* a comment */sub-layer ')[0];
	const b = parse(' another-part  /* trailing comment */')[0];

	assert.equal(a.concat(b).toString(), 'some-layer.sub-layer.another-part');
	assert.deepEqual(a.concat(b).toJSON(), {
		parts: [
			['ident-token', 'some-layer', 1, 10, { value: 'some-layer' }],
			['delim-token', '.', 11, 11, { value: '.' }],
			['ident-token', 'sub-layer', 27, 35, { value: 'sub-layer' }],
			['delim-token', '.', -1, -1, { value: '.' }],
			[
				'ident-token',
				'another-part',
				1,
				12,
				{ value: 'another-part' },
			],
		],
		segments: ['some-layer', 'sub-layer', 'another-part'],
		name: 'some-layer.sub-layer.another-part',
	});
}

{
	const a = parse(' another-part  /* trailing comment */')[0];
	const b = parse(' some-layer./* a comment */sub-layer ')[0];

	assert.equal(a.concat(b).toString(), 'another-part.some-layer.sub-layer');
	assert.deepEqual(a.concat(b).toJSON(), {
		parts: [
			[
				'ident-token',
				'another-part',
				1,
				12,
				{ value: 'another-part' },
			],
			['delim-token', '.', -1, -1, { value: '.' }],
			['ident-token', 'some-layer', 1, 10, { value: 'some-layer' }],
			['delim-token', '.', 11, 11, { value: '.' }],
			['ident-token', 'sub-layer', 27, 35, { value: 'sub-layer' }],
		],
		segments: ['another-part', 'some-layer', 'sub-layer'],
		name: 'another-part.some-layer.sub-layer',
	});
}

