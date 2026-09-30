import assert from 'node:assert';
import { mirrorVariant, mirrorVariantType, TokenType } from '@csstools/css-tokenizer';

{
	{
		assert.strictEqual(mirrorVariantType(TokenType.OpenParen), TokenType.CloseParen);
		assert.strictEqual(mirrorVariantType(TokenType.CloseParen), TokenType.OpenParen);
		assert.strictEqual(mirrorVariantType(TokenType.OpenCurly), TokenType.CloseCurly);
		assert.strictEqual(mirrorVariantType(TokenType.CloseCurly), TokenType.OpenCurly);
		assert.strictEqual(mirrorVariantType(TokenType.OpenSquare), TokenType.CloseSquare);
		assert.strictEqual(mirrorVariantType(TokenType.CloseSquare), TokenType.OpenSquare);
	}

	{
		assert.strictEqual(mirrorVariantType(TokenType.Ident), null);
		assert.strictEqual(mirrorVariantType(TokenType.Number), null);
		assert.strictEqual(mirrorVariantType(TokenType.EOF), null);
	}
}

{
	{
		assert.deepEqual(mirrorVariant([TokenType.OpenParen, '(', 0, 0, undefined]), [TokenType.CloseParen, ')', -1, -1, undefined]);
		assert.deepEqual(mirrorVariant([TokenType.CloseParen, ')', 0, 0, undefined]), [TokenType.OpenParen, '(', -1, -1, undefined]);
		assert.deepEqual(mirrorVariant([TokenType.OpenCurly, '{', 0, 0, undefined]), [TokenType.CloseCurly, '}', -1, -1, undefined]);
		assert.deepEqual(mirrorVariant([TokenType.CloseCurly, '}', 0, 0, undefined]), [TokenType.OpenCurly, '{', -1, -1, undefined]);
		assert.deepEqual(mirrorVariant([TokenType.OpenSquare, '[', 0, 0, undefined]), [TokenType.CloseSquare, ']', -1, -1, undefined]);
		assert.deepEqual(mirrorVariant([TokenType.CloseSquare, ']', 0, 0, undefined]), [TokenType.OpenSquare, '[', -1, -1, undefined]);
	}

	{
		assert.strictEqual(mirrorVariant([TokenType.Ident, 'foo', 0, 2, { value: 'foo' }]), null);
		assert.strictEqual(mirrorVariant([TokenType.EOF, '', -1, -1, undefined]), null);
	}
}
