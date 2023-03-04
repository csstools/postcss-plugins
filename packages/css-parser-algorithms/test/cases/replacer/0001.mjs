import { tokenize, TokenType } from '@csstools/css-tokenizer';
import assert from 'assert';
import { CommentNode, replaceComponentValues, isCommentNode, parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';

const commentReplacer = (x) => {
	if (isCommentNode(x)) {
		return new CommentNode([
			TokenType.Comment,
			'/* generated comment */',
			-1,
			-1,
			undefined,
		]);
	}
};

const onParseError = (err) => {
	throw err;
};

{
	const tokens = tokenize({ css: '/* a comment */' }, { onParseError: onParseError });
	const resultAST = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	const afterReplacement = replaceComponentValues(resultAST, commentReplacer);

	assert.deepStrictEqual(
		stringify(afterReplacement),
		'/* generated comment */',
	);
}

{
	const tokens = tokenize({ css: '(/* a comment */foo  ) something else' }, { onParseError: onParseError });
	const resultAST = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	const afterReplacement = replaceComponentValues(resultAST, commentReplacer);

	assert.deepStrictEqual(
		stringify(afterReplacement),
		'(/* generated comment */foo  ) something else',
	);
}

{
	const tokens = tokenize({ css: '(/* a comment */foo /* a comment */ /* a comment */) something else /* a comment */' }, { onParseError: onParseError });
	const resultAST = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	const afterReplacement = replaceComponentValues(resultAST, commentReplacer);

	assert.deepStrictEqual(
		stringify(afterReplacement),
		'(/* generated comment */foo /* generated comment */ /* generated comment */) something else /* generated comment */',
	);
}

{
	const tokens = tokenize({ css: '/* foo */, [/* bar */],, ,,(/* baz */ {/* fooz */ calc(/* last one */)})' }, { onParseError: onParseError });
	const resultAST = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	const afterReplacement = replaceComponentValues(resultAST, commentReplacer);

	assert.deepStrictEqual(
		stringify(afterReplacement),
		'/* generated comment */, [/* generated comment */],, ,,(/* generated comment */ {/* generated comment */ calc(/* generated comment */)})',
	);
}
