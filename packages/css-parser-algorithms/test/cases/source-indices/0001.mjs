import { tokenize } from '@csstools/css-tokenizer';
import assert from 'assert';
import { parseCommaSeparatedListOfComponentValues, sourceIndices } from '@csstools/css-parser-algorithms';

const onParseError = (err) => {
	throw err;
};

{
	const indices = [
		[52, 65],
		[51, 51],
		[51, 65],
		[45, 48],
		[44, 44],
		[43, 43],
		[39, 40],
		[38, 38],
		[37, 37],
		[36, 36],
		[35, 35],
		[30, 41],
		[29, 29],
		[16, 27],
		[12, 28],
		[11, 11],
		[1, 42],
		[0, 49],
		[0, 49],
	];

	const parts = [
		'something-else',
		' ',
		' something-else',
		'50px',
		' ',
		',',
		'1x',
		' ',
		'*',
		' ',
		'2',
		'calc(2 * 1x)',
		' ',
		'"image1.jpg"',
		'url("image1.jpg")',
		' ',
		'image-set( url("image1.jpg") calc(2 * 1x))',
		'(image-set( url("image1.jpg") calc(2 * 1x)), 50px)',
		'(image-set( url("image1.jpg") calc(2 * 1x)), 50px)',
	];

	const source = '(image-set( url("image1.jpg") calc(2 * 1x)), 50px), something-else';

	const tokens = tokenize({ css: source }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		{
			const x = sourceIndices(listItem);
			assert.deepStrictEqual(x, indices.pop());
			assert.deepStrictEqual(source.slice(x[0], x[1] + 1), parts.pop());
		}

		listItem.forEach((componentValue) => {
			{
				const x = sourceIndices(componentValue);
				assert.deepStrictEqual(x, indices.pop());
				assert.deepStrictEqual(source.slice(x[0], x[1] + 1), parts.pop());
			}

			if ('walk' in componentValue) {
				componentValue.walk((entry) => {
					const x = sourceIndices(entry.node);
					assert.deepStrictEqual(x, indices.pop());
					assert.deepStrictEqual(source.slice(x[0], x[1] + 1), parts.pop());
				});
			}
		});
	});
}
