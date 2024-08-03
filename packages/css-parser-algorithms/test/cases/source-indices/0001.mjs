import { tokenize } from '@csstools/css-tokenizer';
import assert from 'node:assert';
import test from 'node:test';
import { parseCommaSeparatedListOfComponentValues, sourceIndices } from '@csstools/css-parser-algorithms';

const onParseError = (err) => {
	throw err;
};

test('source indices', () => {
	const indicesAndParts = [
		[[0, 49], '(image-set( url("image1.jpg") calc(2 * 1x)), 50px)'],
		[[0, 49], '(image-set( url("image1.jpg") calc(2 * 1x)), 50px)'],
		[[1, 42], 'image-set( url("image1.jpg") calc(2 * 1x))'],
		[[11, 11], ' '],
		[[12, 28], 'url("image1.jpg")'],
		[[16, 27], '"image1.jpg"'],
		[[29, 29], ' '],
		[[30, 41], 'calc(2 * 1x)'],
		[[35, 35], '2'],
		[[36, 36], ' '],
		[[37, 37], '*'],
		[[38, 38], ' '],
		[[39, 40], '1x'],
		[[43, 43], ','],
		[[44, 44], ' '],
		[[45, 48], '50px'],
		[[51, 65], ' something-else'],
		[[51, 51], ' '],
		[[52, 65], 'something-else'],
	].reverse();

	const source = '(image-set( url("image1.jpg") calc(2 * 1x)), 50px), something-else';

	const tokens = tokenize({ css: source }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		{
			const [y, part] = indicesAndParts.pop();
			const x = sourceIndices(listItem);
			assert.deepStrictEqual(x, y);
			assert.deepStrictEqual(source.slice(x[0], x[1] + 1), part);
		}

		listItem.forEach((componentValue) => {
			{
				const [y, part] = indicesAndParts.pop();
				const x = sourceIndices(componentValue);
				assert.deepStrictEqual(x, y);
				assert.deepStrictEqual(source.slice(x[0], x[1] + 1), part);
			}

			if ('walk' in componentValue) {
				componentValue.walk((entry) => {
					const [y, part] = indicesAndParts.pop();
					const x = sourceIndices(entry.node);
					assert.deepStrictEqual(x, y);
					assert.deepStrictEqual(source.slice(x[0], x[1] + 1), part);
				});
			}
		});
	});
});
