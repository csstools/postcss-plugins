import { tokenize } from '@csstools/css-tokenizer';
import assert from 'assert';
import { parseListOfComponentValues, parseComponentValue, walk } from '@csstools/css-parser-algorithms';

const onParseError = (err) => {
	throw err;
};

// Simple, shallow walk without mutations.
// This is purely a baseline.
{
	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
			{ index: 3, node: '/', parent: 'foo(a/b/c)' },
			{ index: 4, node: 'c', parent: 'foo(a/b/c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/b/c)',
	);
}

// Delete 2 nodes at the end.
{
	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.splice(index, 2);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'c', parent: 'foo(a/c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/c)',
	);
}

// Delete a single node in the middle.
{
	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.splice(index, 1);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
			{ index: 2, node: '/', parent: 'foo(a//c)' },
			{ index: 3, node: 'c', parent: 'foo(a//c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a//c)',
	);
}

// Delete 2 nodes in the middle.
{
	const tokens = tokenize({ css: 'foo(a/b,c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === '/') {
			entry.parent.value.splice(index, 2);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b,c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b,c)' },
			{ index: 1, node: '/', parent: 'foo(a/b,c)' },
			{ index: 1, node: ',', parent: 'foo(a,c)' },
			{ index: 2, node: 'c', parent: 'foo(a,c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a,c)',
	);
}

// Delete 2 nodes but the parent is a block, not a function
{
	const tokens = tokenize({ css: '(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.splice(index, 2);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: '(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: '(a/b/c)' },
			{ index: 1, node: '/', parent: '(a/b/c)' },
			{ index: 2, node: 'b', parent: '(a/b/c)' },
			{ index: 2, node: 'c', parent: '(a/c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'(a/c)',
	);
}

// Setting the list to an empty array works.
{
	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value = [];
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo()',
	);
}

// Reversing an array stops the iteration.
{
	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.reverse();
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
			{ index: 3, node: '/', parent: 'foo(c/b/a)' },
			{ index: 4, node: 'a', parent: 'foo(c/b/a)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(c/b/a)',
	);
}

// Insert a sub tree at the current position
{
	const tokensSubTree = tokenize({ css: 'bar(d)' }, { onParseError: onParseError });
	const componentValueSubTree = parseComponentValue(tokensSubTree, { onParseError: onParseError });

	const tokens = tokenize({ css: 'foo(a/b/c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.splice(index, 1, componentValueSubTree);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b/c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b/c)' },
			{ index: 1, node: '/', parent: 'foo(a/b/c)' },
			{ index: 2, node: 'b', parent: 'foo(a/b/c)' },
			{ index: 3, node: '/', parent: 'foo(a/bar(d)/c)' },
			{ index: 4, node: 'c', parent: 'foo(a/bar(d)/c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/bar(d)/c)',
	);
}

// Insert a sub tree at the next position
{
	const tokensSubTree = tokenize({ css: 'bar(d)' }, { onParseError: onParseError });
	const componentValueSubTree = parseComponentValue(tokensSubTree, { onParseError: onParseError });

	const tokens = tokenize({ css: 'foo(a/b,c)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === '/') {
			entry.parent.value.splice(index+1, 1, componentValueSubTree);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b,c)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b,c)' },
			{ index: 1, node: '/', parent: 'foo(a/b,c)' },
			{ index: 2, node: 'bar(d)', parent: 'foo(a/bar(d),c)' },
			{ index: 0, node: 'd', parent: 'bar(d)' },
			{ index: 3, node: ',', parent: 'foo(a/bar(d),c)' },
			{ index: 4, node: 'c', parent: 'foo(a/bar(d),c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/bar(d),c)',
	);
}

// Remove the last item
{
	const tokens = tokenize({ css: 'foo(a/b)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.splice(index, 1);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b)' },
			{ index: 1, node: '/', parent: 'foo(a/b)' },
			{ index: 2, node: 'b', parent: 'foo(a/b)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/)',
	);
}

// Remove the next item, that item is the last item
{
	const tokens = tokenize({ css: 'foo(a/b)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === '/') {
			entry.parent.value.splice(index+1, 1);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b)' },
			{ index: 1, node: '/', parent: 'foo(a/b)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/)',
	);
}

// Empty thing
{
	const tokens = tokenize({ css: 'foo()' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});
	});

	assert.deepStrictEqual(
		result,
		[{ index: 0, node: 'foo()', parent: '[object Object]' }],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo()',
	);
}

// Append an item
{
	const otherTokens = tokenize({ css: '#c' }, { onParseError: onParseError });
	const otherComponentValue = parseComponentValue(otherTokens, { onParseError: onParseError });

	const tokens = tokenize({ css: 'foo(a/b)' }, { onParseError: onParseError });
	const componentValue = parseListOfComponentValues(tokens, { onParseError: onParseError });
	assert.ok(componentValue);

	const result = [];
	walk(componentValue, (entry, index) => {
		result.push({
			index: index,
			node: entry.node.toString(),
			parent: entry.parent.toString(),
		});

		if (entry.node.toString() === 'b') {
			entry.parent.value.push(otherComponentValue);
		}
	});

	assert.deepStrictEqual(
		result,
		[
			{ index: 0, node: 'foo(a/b)', parent: '[object Object]' },
			{ index: 0, node: 'a', parent: 'foo(a/b)' },
			{ index: 1, node: '/', parent: 'foo(a/b)' },
			{ index: 2, node: 'b', parent: 'foo(a/b)' },
			{ index: 3, node: '#c', parent: 'foo(a/b#c)' },
		],
	);

	assert.strictEqual(
		componentValue.toString(),
		'foo(a/b#c)',
	);
}
