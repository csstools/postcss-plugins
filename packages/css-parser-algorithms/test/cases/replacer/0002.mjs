import { TokenType, tokenize } from '@csstools/css-tokenizer';
import assert from 'assert';
import {replaceComponentValues, parseComponentValue, isFunctionNode, TokenNode } from '@csstools/css-parser-algorithms';

// https://github.com/csstools/postcss-plugins/issues/1202
{
	let visited = [];

	const value = parseComponentValue(tokenize({ css: 'foo(bar(baz)bar2())' }));
	replaceComponentValues([[value]], node => {
		visited.push(node.toString());
		if (isFunctionNode(node) && node.getName() === 'bar') {
			return new TokenNode([TokenType.Delim, '/', node.value[2], node.value[3], { value: '/' }]);
		}
	});

	assert.deepStrictEqual(
		visited,
		['foo(bar(baz)bar2())', 'bar(baz)', 'bar2()'],
	);

	assert.deepStrictEqual(
		value.toString(),
		'foo(/bar2())',
	);
}
