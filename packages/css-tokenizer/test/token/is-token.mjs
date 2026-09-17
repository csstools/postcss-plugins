import assert from 'node:assert';
import {
	isToken,
	isTokenAtKeyword,
	isTokenBadString,
	isTokenBadURL,
	isTokenCDC,
	isTokenCDO,
	isTokenCloseCurly,
	isTokenCloseParen,
	isTokenCloseSquare,
	isTokenColon,
	isTokenComma,
	isTokenComment,
	isTokenDelim,
	isTokenDimension,
	isTokenEOF,
	isTokenFunction,
	isTokenHash,
	isTokenIdent,
	isTokenNumber,
	isTokenNumeric,
	isTokenOpenCurly,
	isTokenOpenParen,
	isTokenOpenSquare,
	isTokenPercentage,
	isTokenSemicolon,
	isTokenString,
	isTokenURL,
	isTokenUnicodeRange,
	isTokenWhitespace,
	isTokenWhiteSpaceOrComment,
	NumberType,
	TokenType,
} from '@csstools/css-tokenizer';

assert.ok(isToken([TokenType.Number, (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]));
assert.ok(isToken(['number-token', (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]));
assert.ok(!isToken(null));
assert.ok(!isToken(undefined));
assert.ok(!isToken([TokenType.Number, (3).toString(), -1]));
assert.ok(!isToken(['not-a-token', (3).toString(), -1, -1, { value: 3 }]));

{
	const tokenByType = {
		[TokenType.AtKeyword]: [TokenType.AtKeyword, '@foo', 0, 3, { value: 'foo' }],
		[TokenType.BadString]: [TokenType.BadString, 'bad-string-token', 0, 3, undefined],
		[TokenType.BadURL]: [TokenType.BadURL, 'bad-url-token', 0, 3, undefined],
		[TokenType.CDC]: [TokenType.CDC, '-->', 0, 2, undefined],
		[TokenType.CDO]: [TokenType.CDO, '<!--', 0, 3, undefined],
		[TokenType.CloseCurly]: [TokenType.CloseCurly, '}', 0, 0, undefined],
		[TokenType.CloseParen]: [TokenType.CloseParen, ')', 0, 0, undefined],
		[TokenType.CloseSquare]: [TokenType.CloseSquare, ']', 0, 0, undefined],
		[TokenType.Colon]: [TokenType.Colon, ':', 0, 0, undefined],
		[TokenType.Comma]: [TokenType.Comma, ',', 0, 0, undefined],
		[TokenType.Comment]: [TokenType.Comment, '/*x*/', 0, 4, undefined],
		[TokenType.Delim]: [TokenType.Delim, '*', 0, 0, { value: '*' }],
		[TokenType.Dimension]: [TokenType.Dimension, '3px', 0, 2, { value: 3, unit: 'px', type: NumberType.Integer }],
		[TokenType.EOF]: [TokenType.EOF, '', -1, -1, undefined],
		[TokenType.Function]: [TokenType.Function, 'foo(', 0, 3, { value: 'foo' }],
		[TokenType.Hash]: [TokenType.Hash, '#foo', 0, 3, { value: 'foo', type: 'id' }],
		[TokenType.Ident]: [TokenType.Ident, 'foo', 0, 2, { value: 'foo' }],
		[TokenType.Number]: [TokenType.Number, '3', 0, 0, { value: 3, type: NumberType.Integer }],
		[TokenType.OpenCurly]: [TokenType.OpenCurly, '{', 0, 0, undefined],
		[TokenType.OpenParen]: [TokenType.OpenParen, '(', 0, 0, undefined],
		[TokenType.OpenSquare]: [TokenType.OpenSquare, '[', 0, 0, undefined],
		[TokenType.Percentage]: [TokenType.Percentage, '3%', 0, 1, { value: 3 }],
		[TokenType.Semicolon]: [TokenType.Semicolon, ';', 0, 0, undefined],
		[TokenType.String]: [TokenType.String, '"foo"', 0, 4, { value: 'foo' }],
		[TokenType.URL]: [TokenType.URL, 'url(foo)', 0, 7, { value: 'foo' }],
		[TokenType.UnicodeRange]: [TokenType.UnicodeRange, 'U+0-7F', 0, 6, { startOfRange: 0, endOfRange: 127 }],
		[TokenType.Whitespace]: [TokenType.Whitespace, ' ', 0, 0, undefined],
	};

	const predicates = [
		isTokenAtKeyword,
		isTokenBadString,
		isTokenBadURL,
		isTokenCDC,
		isTokenCDO,
		isTokenCloseCurly,
		isTokenCloseParen,
		isTokenCloseSquare,
		isTokenColon,
		isTokenComma,
		isTokenComment,
		isTokenDelim,
		isTokenDimension,
		isTokenEOF,
		isTokenFunction,
		isTokenHash,
		isTokenIdent,
		isTokenNumber,
		isTokenOpenCurly,
		isTokenOpenParen,
		isTokenOpenSquare,
		isTokenPercentage,
		isTokenSemicolon,
		isTokenString,
		isTokenURL,
		isTokenUnicodeRange,
		isTokenWhitespace,
	];

	const everyOtherToken = Object.entries(tokenByType).map(([type, token]) => ({ type, token }));

	for (const predicate of predicates) {
		for (const { type, token } of everyOtherToken) {
			assert.strictEqual(
				predicate(token),
				token[0] === tokenByTypeEntryForPredicate(predicate),
				`${predicate.name} for ${type}`,
			);
		}

		assert.strictEqual(predicate(undefined), false, `${predicate.name} for undefined`);
		assert.strictEqual(predicate(null), false, `${predicate.name} for null`);
	}
}

function tokenByTypeEntryForPredicate(predicate) {
	switch (predicate) {
		case isTokenAtKeyword: return TokenType.AtKeyword;
		case isTokenBadString: return TokenType.BadString;
		case isTokenBadURL: return TokenType.BadURL;
		case isTokenCDC: return TokenType.CDC;
		case isTokenCDO: return TokenType.CDO;
		case isTokenCloseCurly: return TokenType.CloseCurly;
		case isTokenCloseParen: return TokenType.CloseParen;
		case isTokenCloseSquare: return TokenType.CloseSquare;
		case isTokenColon: return TokenType.Colon;
		case isTokenComma: return TokenType.Comma;
		case isTokenComment: return TokenType.Comment;
		case isTokenDelim: return TokenType.Delim;
		case isTokenDimension: return TokenType.Dimension;
		case isTokenEOF: return TokenType.EOF;
		case isTokenFunction: return TokenType.Function;
		case isTokenHash: return TokenType.Hash;
		case isTokenIdent: return TokenType.Ident;
		case isTokenNumber: return TokenType.Number;
		case isTokenOpenCurly: return TokenType.OpenCurly;
		case isTokenOpenParen: return TokenType.OpenParen;
		case isTokenOpenSquare: return TokenType.OpenSquare;
		case isTokenPercentage: return TokenType.Percentage;
		case isTokenSemicolon: return TokenType.Semicolon;
		case isTokenString: return TokenType.String;
		case isTokenURL: return TokenType.URL;
		case isTokenUnicodeRange: return TokenType.UnicodeRange;
		case isTokenWhitespace: return TokenType.Whitespace;
		default: throw new Error('unexpected predicate');
	}
}

{
	assert.ok(isTokenNumeric([TokenType.Number, '3', -1, -1, { value: 3, type: NumberType.Integer }]));
	assert.ok(isTokenNumeric([TokenType.Dimension, '3px', -1, -1, { value: 3, type: NumberType.Integer, unit: 'px' }]));
	assert.ok(isTokenNumeric([TokenType.Percentage, '3%', -1, -1, { value: 3 }]));
	assert.ok(!isTokenNumeric([TokenType.Ident, 'foo', -1, -1, { value: 'foo' }]));
	assert.ok(!isTokenNumeric(undefined));
}

{
	assert.ok(isTokenWhiteSpaceOrComment([TokenType.Whitespace, ' ', -1, -1, undefined]));
	assert.ok(isTokenWhiteSpaceOrComment([TokenType.Comment, '/*x*/', -1, -1, undefined]));
	assert.ok(!isTokenWhiteSpaceOrComment([TokenType.Ident, 'foo', -1, -1, { value: 'foo' }]));
	assert.ok(!isTokenWhiteSpaceOrComment(undefined));
}
