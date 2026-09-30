import {
	APOSTROPHE,
	ASTERISK,
	CARRIAGE_RETURN,
	CHARACTER_TABULATION,
	COLON,
	COMMA,
	COMMERCIAL_AT,
	DIGIT_ZERO,
	EXCLAMATION_MARK,
	FORM_FEED,
	FULL_STOP,
	GREATER_THAN_SIGN,
	HYPHEN_MINUS,
	LATIN_CAPITAL_LETTER_E,
	LATIN_CAPITAL_LETTER_F,
	LATIN_CAPITAL_LETTER_L,
	LATIN_CAPITAL_LETTER_R,
	LATIN_CAPITAL_LETTER_U,
	LATIN_SMALL_LETTER_E,
	LATIN_SMALL_LETTER_L,
	LATIN_SMALL_LETTER_R,
	LATIN_SMALL_LETTER_U,
	LEFT_CURLY_BRACKET,
	LEFT_PARENTHESIS,
	LEFT_SQUARE_BRACKET,
	LESS_THAN_SIGN,
	LINE_FEED,
	LOW_LINE,
	MAXIMUM_ALLOWED_CODEPOINT,
	NULL,
	NUMBER_SIGN,
	PERCENTAGE_SIGN,
	PLUS_SIGN,
	QUESTION_MARK,
	QUOTATION_MARK,
	REPLACEMENT_CHARACTER,
	REVERSE_SOLIDUS,
	RIGHT_CURLY_BRACKET,
	RIGHT_PARENTHESIS,
	RIGHT_SQUARE_BRACKET,
	SEMICOLON,
	SOLIDUS,
	SPACE,
} from './code-points/code-points';
import type { CSSToken } from './interfaces/token';
import { HashType, NumberType, TokenType } from './interfaces/token';
import { ParseError, ParseErrorMessage, ParseErrorWithToken } from './interfaces/error';
import { isNewLine, isSurrogate, isNonASCII_IdentCodePoint, isHexDigitCodePoint, isWhitespace, isNonPrintableCodePoint, isIdentStartCodePoint, isDigitCodePoint } from './code-points/ranges';

/**
 * Tokenize a CSS string into a list of tokens.
 */
export function tokenize(
	input: {
		css: { valueOf(): string },
		unicodeRangesAllowed?: boolean,
	},
	options?: {
		onParseError?: (error: ParseError) => void
	},
): Array<CSSToken> {
	const t = tokenizer(input, options);

	const tokens: Array<CSSToken> = [];

	while (!t.endOfFile()) {
		tokens.push(t.nextToken());
	}

	tokens.push(t.nextToken()); // EOF-token

	return tokens;
}

/**
 * Create a tokenizer for a CSS string.
 */
export function tokenizer(
	input: {
		css: {
			valueOf(): string
		},
		unicodeRangesAllowed?: boolean,
	},
	options?: {
		onParseError?: (error: ParseError) => void
	},
): { nextToken: () => CSSToken, endOfFile: () => boolean } {
	const source = input.css.valueOf();
	const unicodeRangesAllowed = input.unicodeRangesAllowed ?? false;

	/** The position of the next code point that will be read. */
	let cursor = 0;
	/** The index of the first code point of the current token. */
	let representationStart = 0;
	/** The index of the last code point of the current token. */
	let representationEnd = -1;

	/**
	 * Set by {@link consumeIdentSequence}: true when the returned ident value is the raw
	 * source substring (no NULL, surrogate or escape code points were decoded).
	 */
	let identIsPlainRepr = false;

	const onParseError = options?.onParseError ?? noop;

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-name
	//
	// Fast path: when the ident sequence contains no NULL, surrogate or escape code points,
	// the decoded value is the raw source substring and is returned as a single slice.
	function consumeIdentSequence(): string {
		const start = cursor;

		// Scan the ident sequence without building a string.
		// NULL, surrogates and escapes must be decoded and fall through to the decode pass.
		while (true) {
			// ASCII fast path: letters, digits, underscore and hyphen are always ident code points.
			const asciiCodeUnit = source.charCodeAt(cursor);
			if (
				(asciiCodeUnit >= 0x0041 && asciiCodeUnit <= 0x005a) || // A .. Z
				(asciiCodeUnit >= 0x0061 && asciiCodeUnit <= 0x007a) || // a .. z
				(asciiCodeUnit >= 0x0030 && asciiCodeUnit <= 0x0039) || // 0 .. 9
				asciiCodeUnit === HYPHEN_MINUS ||
				asciiCodeUnit === LOW_LINE
			) {
				cursor += 1;
				continue;
			}

			const codePoint = source.codePointAt(cursor) ?? -1;
			if (
				codePoint === NULL ||
				(codePoint >= 0xd800 && codePoint <= 0xdfff) || // surrogate
				// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
				(codePoint === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1))
			) {
				break;
			}

			// A non-ASCII ident code point.
			// https://drafts.csswg.org/css-syntax/#non-ascii-ident-code-point
			if (isNonASCII_IdentCodePoint(codePoint)) {
				cursor += 1 + +(codePoint > 0xffff);
				continue;
			}

			break;
		}

		// If the scan stopped on a code point that does not need decoding, the ident is plain.
		const stopCodePoint = source.codePointAt(cursor) ?? -1;
		if (
			stopCodePoint !== NULL &&
			!(stopCodePoint >= 0xd800 && stopCodePoint <= 0xdfff) && // surrogate
			!(stopCodePoint === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1)) // valid escape
		) {
			identIsPlainRepr = true;
			representationEnd = cursor - 1;
			return source.slice(start, cursor);
		}

		// Decode pass: NULL, surrogate and escape code points require decoding.
		identIsPlainRepr = false;
		cursor = start;
		representationEnd = -1;

		let result = '';

		while (true) {
			const codePoint = source.codePointAt(cursor) ?? -1;
			if (codePoint === NULL || isSurrogate(codePoint)) {
				result += String.fromCharCode(REPLACEMENT_CHARACTER);
				cursor += 1 + +(codePoint > 0xffff);
				representationEnd = cursor - 1;
				continue;
			}

			// An ident code point is a letter, a digit, an underscore, a hyphen or a non-ASCII ident code point.
			// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
			if (
				(codePoint >= 0x0041 && codePoint <= 0x005a) || // A .. Z
				(codePoint >= 0x0061 && codePoint <= 0x007a) || // a .. z
				(codePoint >= 0x0030 && codePoint <= 0x0039) || // 0 .. 9
				codePoint === HYPHEN_MINUS ||
				codePoint === LOW_LINE ||
				isNonASCII_IdentCodePoint(codePoint)
			) {
				result += codePoint > 0xffff ? String.fromCodePoint(codePoint) : String.fromCharCode(codePoint);
				cursor += 1 + +(codePoint > 0xffff);
				representationEnd = cursor - 1;
				continue;
			}

			if (source.codePointAt(cursor) === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1)) {
				cursor += 1;
				representationEnd = cursor - 1;
				result += String.fromCodePoint(consumeEscapedCodePoint());
				continue;
			}

			return result;
		}
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-escaped-code-point
	function consumeEscapedCodePoint(): number {
		const codePoint = source.codePointAt(cursor);
		if (typeof codePoint === "undefined") {
			onParseError(new ParseError(
				ParseErrorMessage.UnexpectedEOFInEscapedCodePoint,
				representationStart,
				representationEnd,
				[
					'4.3.7. Consume an escaped code point',
					'Unexpected EOF',
				],
			));

			return REPLACEMENT_CHARACTER;
		}

		cursor += 1 + +(codePoint > 0xffff);
		representationEnd = cursor - 1;

		if (isHexDigitCodePoint(codePoint)) {
			const hexSequence: Array<number> = [codePoint];

			let nextCodePoint: number | undefined;
			while ((typeof (nextCodePoint = source.codePointAt(cursor)) !== "undefined") && isHexDigitCodePoint(nextCodePoint) && hexSequence.length < 6) {
				hexSequence.push(nextCodePoint);
				cursor += 1;
				representationEnd = cursor - 1;
			}

			if (isWhitespace(source.codePointAt(cursor) ?? -1)) {
				if (
					source.codePointAt(cursor) === CARRIAGE_RETURN &&
					source.codePointAt(cursor + 1) === LINE_FEED
				) {
					cursor += 1;
				}

				cursor += 1;
				representationEnd = cursor - 1;
			}

			const codePointLiteral = parseInt(String.fromCodePoint(...hexSequence), 16);
			if (codePointLiteral === 0 || isSurrogate(codePointLiteral)) {
				return REPLACEMENT_CHARACTER;
			}
			if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
				return REPLACEMENT_CHARACTER;
			}

			return codePointLiteral;
		}

		if (codePoint === 0 || isSurrogate(codePoint)) {
			return REPLACEMENT_CHARACTER;
		}

		return codePoint;
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
	function consumeBadURL(): void {
		while (true) {
			const codePoint = source.codePointAt(cursor);
			if (typeof codePoint === "undefined") {
				return;
			}

			if (codePoint === RIGHT_PARENTHESIS) {
				cursor += 1;
				representationEnd = cursor - 1;
				return;
			}

			if (codePoint === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1)) {
				cursor += 1;
				representationEnd = cursor - 1;
				consumeEscapedCodePoint();
				continue;
			}

			cursor += 1;
			representationEnd = cursor - 1;
			continue;
		}
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
	function consumeComment(): CSSToken {
		cursor += 2;
		representationEnd = cursor - 1;

		while (true) {
			const codePoint = source.codePointAt(cursor);
			if (typeof codePoint === "undefined") {
				const token: CSSToken = [
					TokenType.Comment,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					undefined,
				];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedEOFInComment,
					representationStart,
					representationEnd,
					[
						'4.3.2. Consume comments',
						'Unexpected EOF',
					],
					token
				));

				return token;
			}

			cursor += 1;
			representationEnd = cursor - 1;

			if (codePoint !== ASTERISK) {
				continue;
			}

			if (typeof source.codePointAt(cursor) === "undefined") {
				continue;
			}

			if (source.codePointAt(cursor) === SOLIDUS) {
				cursor += 1;
				representationEnd = cursor - 1;
				break;
			}
		}

		return [
			TokenType.Comment,
			source.slice(representationStart, representationEnd + 1),
			representationStart,
			representationEnd,
			undefined,
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
	function consumeStringToken(): CSSToken {
		let stringValue = '';
		const first = source.codePointAt(cursor);
		cursor += 1;
		representationEnd = cursor - 1;

		while (true) {
			const next = source.charCodeAt(cursor);
			if (cursor >= source.length) {
				const token: CSSToken = [TokenType.String, source.slice(representationStart, representationEnd + 1), representationStart, representationEnd, { value: stringValue }];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedEOFInString,
					representationStart,
					representationEnd,
					[
						'4.3.5. Consume a string token',
						'Unexpected EOF',
					],
					token
				));

				return token;
			}

			cursor += 1;
			representationEnd = cursor - 1;

			if (isNewLine(next)) {
				cursor -= 1;
				representationEnd = cursor - 1;

				const token: CSSToken = [TokenType.BadString, source.slice(representationStart, representationEnd + 1), representationStart, representationEnd, undefined];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedNewLineInString,
					representationStart,
					(
						(
							source.codePointAt(cursor) === CARRIAGE_RETURN &&
							source.codePointAt(cursor + 1) === LINE_FEED
						) ?
							// CR LF
							representationEnd + 2 :
							// LF
							representationEnd + 1
					),
					[
						'4.3.5. Consume a string token',
						'Unexpected newline',
					],
					token
				));

				return token;
			}

			if (next === first) {
				return [TokenType.String, source.slice(representationStart, representationEnd + 1), representationStart, representationEnd, { value: stringValue }];
			}

			if (next === REVERSE_SOLIDUS) {
				if (typeof source.codePointAt(cursor) === "undefined") {
					continue;
				}
				if (isNewLine(source.codePointAt(cursor) ?? -1)) {
					if (
						source.codePointAt(cursor) === CARRIAGE_RETURN &&
						source.codePointAt(cursor + 1) === LINE_FEED
					) {
						cursor += 1;
					}

					cursor += 1;
					representationEnd = cursor - 1;
					continue;
				}

				stringValue = stringValue + String.fromCodePoint(consumeEscapedCodePoint());
				continue;
			}

			if (next === NULL) {
				stringValue = stringValue + String.fromCharCode(REPLACEMENT_CHARACTER);
				continue;
			}

			// ASCII (fast path)
			if (next < 0x0080) {
				stringValue = stringValue + String.fromCharCode(next);
				continue;
			}

			// Surrogates: an astral code point is read as a whole, a lone surrogate becomes the replacement character.
			if (next >= 0xd800 && next <= 0xdfff) {
				const codePoint = source.codePointAt(cursor - 1) ?? -1;
				if (codePoint >= 0x10000) {
					stringValue = stringValue + String.fromCodePoint(codePoint);
					cursor += 1;
					representationEnd = cursor - 1;
				} else {
					stringValue = stringValue + String.fromCharCode(REPLACEMENT_CHARACTER);
				}
				continue;
			}

			// Non-ASCII BMP code point.
			stringValue = stringValue + String.fromCharCode(next);
		}
	}

	// https://drafts.csswg.org/css-syntax/#consume-a-unicode-range-token
	function consumeUnicodeRangeToken(): CSSToken {
		// 1. Consume the next two input code points and discard them.
		cursor += 2;
		representationEnd = cursor - 1;

		const firstSegment: Array<number> = [];
		const secondSegment: Array<number> = [];

		// 2. Consume as many hex digits as possible,
		// but no more than 6.
		let codePoint: number | undefined;
		while (
			(typeof (codePoint = source.codePointAt(cursor)) !== "undefined") &&
			firstSegment.length < 6 &&
			isHexDigitCodePoint(codePoint)
		) {
			firstSegment.push(codePoint);
			cursor += 1;
			representationEnd = cursor - 1;
		}

		// 2. If less than 6 hex digits were consumed,
		// consume as many U+003F QUESTION MARK (?) code points as possible,
		// but no more than enough to make the total of hex digits and U+003F QUESTION MARK (?) code points equal to 6.
		while (
			(typeof (codePoint = source.codePointAt(cursor)) !== "undefined") &&
			firstSegment.length < 6 &&
			codePoint === QUESTION_MARK
		) {
			if (secondSegment.length === 0) {
				secondSegment.push(...firstSegment);
			}

			// 3. If first segment contains any question mark code points, then:
			// 3.1 Replace the question marks in first segment with U+0030 DIGIT ZERO (0) code points.
			firstSegment.push(DIGIT_ZERO);
			// 3.2. Replace the question marks in first segment with U+0046 LATIN CAPITAL LETTER F (F) code points.
			secondSegment.push(LATIN_CAPITAL_LETTER_F);
			cursor += 1;
			representationEnd = cursor - 1;
		}

		if (!secondSegment.length) {
			// 5. If the next 2 input code points are U+002D HYPHEN-MINUS (-) followed by a hex digit
			if (
				source.codePointAt(cursor) === HYPHEN_MINUS &&
				isHexDigitCodePoint(source.codePointAt(cursor + 1) ?? -1)
			) {
				// 5.1. Consume the next input code point.
				cursor += 1;
				representationEnd = cursor - 1;

				// 5.2 Consume as many hex digits as possible,
				// but no more than 6.
				while (
					(typeof (codePoint = source.codePointAt(cursor)) !== "undefined") &&
					secondSegment.length < 6 &&
					isHexDigitCodePoint(codePoint)
				) {
					secondSegment.push(codePoint);
					cursor += 1;
					representationEnd = cursor - 1;
				}
			}
		}

		if (!secondSegment.length) {
			// Interpret the consumed code points as a hexadecimal number.
			const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);

			// Return a new <unicode-range-token> both starting and ending at start of range.
			return [
				TokenType.UnicodeRange,
				source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					startOfRange: startOfRange,
					endOfRange: startOfRange,
				},
			];
		}

		// Interpret the consumed code points as a hexadecimal number.
		const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
		const endOfRange = parseInt(String.fromCodePoint(...secondSegment), 16);

		// Return a new <unicode-range-token> starting at start of range and ending at end of range.
		return [
			TokenType.UnicodeRange,
			source.slice(representationStart, representationEnd + 1),
			representationStart,
			representationEnd,
			{
				startOfRange: startOfRange,
				endOfRange: endOfRange,
			},
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
	function consumeUrlToken(): CSSToken {
		// Consume as much whitespace as possible.
		while (isWhitespace(source.codePointAt(cursor) ?? -1)) {
			cursor += 1;
			representationEnd = cursor - 1;
		}

		let urlValue = '';

		while (true) {
			if (typeof source.codePointAt(cursor) === "undefined") {
				const token: CSSToken = [
					TokenType.URL,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					{
						value: urlValue,
					},
				];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedEOFInURL,
					representationStart,
					representationEnd,
					[
						'4.3.6. Consume a url token',
						'Unexpected EOF',
					],
					token,
				));

				return token;
			}

			if (source.codePointAt(cursor) === RIGHT_PARENTHESIS) {
				cursor += 1;
				representationEnd = cursor - 1;
				return [
					TokenType.URL,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					{
						value: urlValue,
					},
				];
			}

			if (isWhitespace(source.codePointAt(cursor) ?? -1)) {
				cursor += 1;
				representationEnd = cursor - 1;
				while (isWhitespace(source.codePointAt(cursor) ?? -1)) {
					cursor += 1;
					representationEnd = cursor - 1;
				}

				if (typeof source.codePointAt(cursor) === "undefined") {
					const token: CSSToken = [
						TokenType.URL,
						source.slice(representationStart, representationEnd + 1),
						representationStart,
						representationEnd,
						{
							value: urlValue,
						},
					];

					onParseError(new ParseErrorWithToken(
						ParseErrorMessage.UnexpectedEOFInURL,
						representationStart,
						representationEnd,
						[
							'4.3.6. Consume a url token',
							'Consume as much whitespace as possible',
							'Unexpected EOF',
						],
						token
					));

					return token;
				}

				if (source.codePointAt(cursor) === RIGHT_PARENTHESIS) {
					cursor += 1;
					representationEnd = cursor - 1;
					return [
						TokenType.URL,
						source.slice(representationStart, representationEnd + 1),
						representationStart,
						representationEnd,
						{
							value: urlValue,
						},
					];
				}

				consumeBadURL();
				return [
					TokenType.BadURL,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					undefined,
				];
			}

			const codePoint = source.codePointAt(cursor);
			if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint ?? -1)) {
				consumeBadURL();

				const token: CSSToken = [
					TokenType.BadURL,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					undefined,
				];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.UnexpectedCharacterInURL,
					representationStart,
					representationEnd,
					[
						'4.3.6. Consume a url token',
						'Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE (\'), U+0028 LEFT PARENTHESIS (() or non-printable code point',
					],
					token
				));

				return token;
			}

			if (codePoint === REVERSE_SOLIDUS) {
				if (codePoint === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1)) {
					cursor += 1;
					representationEnd = cursor - 1;
					urlValue = urlValue + String.fromCodePoint(consumeEscapedCodePoint());
					continue;
				}

				consumeBadURL();

				const token: CSSToken = [
					TokenType.BadURL,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					undefined,
				];

				onParseError(new ParseErrorWithToken(
					ParseErrorMessage.InvalidEscapeSequenceInURL,
					representationStart,
					representationEnd,
					[
						'4.3.6. Consume a url token',
						'U+005C REVERSE SOLIDUS (\\)',
						'The input stream does not start with a valid escape sequence',
					],
					token
				));

				return token;
			}

			if (codePoint === NULL || isSurrogate(codePoint ?? -1)) {
				urlValue = urlValue + String.fromCharCode(REPLACEMENT_CHARACTER);
				cursor += 1;
				representationEnd = cursor - 1;
				continue;
			}

			urlValue = urlValue + String.fromCodePoint(codePoint ?? REPLACEMENT_CHARACTER);
			cursor += 1 + +((codePoint ?? -1) > 0xffff);
			representationEnd = cursor - 1;
		}
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token
	function consumeNumericToken(): CSSToken {
		let signCharacter: undefined | '+' | '-' = undefined;

		{
			const peek = source.charCodeAt(cursor);
			if (peek === HYPHEN_MINUS) {
				signCharacter = '-';
			} else if (peek === PLUS_SIGN) {
				signCharacter = '+';
			}
		}

		// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
		let numberType = NumberType.Integer;

		// 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), consume it and append it to repr.
		const sign = source.charCodeAt(cursor);
		if (sign === PLUS_SIGN || sign === HYPHEN_MINUS) {
			cursor += 1;
		}

		// 3. While the next input code point is a digit, consume it and append it to repr.
		let digit = source.charCodeAt(cursor);
		while (digit >= 0x0030 && digit <= 0x0039) {
			cursor += 1;
			digit = source.charCodeAt(cursor);
		}

		// 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
		if (source.charCodeAt(cursor) === FULL_STOP && source.charCodeAt(cursor + 1) >= 0x0030 && source.charCodeAt(cursor + 1) <= 0x0039) {
			// 4.1. Consume them.
			cursor += 2;

			// 4.3. Set type to "number".
			numberType = NumberType.Number;

			// 4.4. While the next input code point is a digit, consume it and append it to repr.
			digit = source.charCodeAt(cursor);
			while (digit >= 0x0030 && digit <= 0x0039) {
				cursor += 1;
				digit = source.charCodeAt(cursor);
			}
		}

		// 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e),
		// optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+),
		// followed by a digit, then:
		const exponent = source.charCodeAt(cursor);
		if (exponent === LATIN_SMALL_LETTER_E || exponent === LATIN_CAPITAL_LETTER_E) {
			const exponentSign = source.charCodeAt(cursor + 1);
			if (exponentSign >= 0x0030 && exponentSign <= 0x0039) {
				// 5.1. Consume them.
				cursor += 2;

				// 5.3. Set type to "number".
				numberType = NumberType.Number;

				// 5.4. While the next input code point is a digit, consume it and append it to repr.
				digit = source.charCodeAt(cursor);
				while (digit >= 0x0030 && digit <= 0x0039) {
					cursor += 1;
					digit = source.charCodeAt(cursor);
				}
			} else if (
				(exponentSign === HYPHEN_MINUS || exponentSign === PLUS_SIGN) &&
				source.charCodeAt(cursor + 2) >= 0x0030 &&
				source.charCodeAt(cursor + 2) <= 0x0039
			) {
				// 5.1. Consume them.
				cursor += 3;

				// 5.3. Set type to "number".
				numberType = NumberType.Number;

				// 5.4. While the next input code point is a digit, consume it and append it to repr.
				digit = source.charCodeAt(cursor);
				while (digit >= 0x0030 && digit <= 0x0039) {
					cursor += 1;
					digit = source.charCodeAt(cursor);
				}
			}
		}

		representationEnd = cursor - 1;

		const numberValue = parseFloat(source.slice(representationStart, representationEnd + 1));

		if (checkIfThreeCodePointsWouldStartAnIdentSequence()) {
			const unit = consumeIdentSequence();
			return [
				TokenType.Dimension,
				source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					value: numberValue,
					signCharacter: signCharacter,
					type: numberType,
					unit: unit,
				},
			];
		}

		if (source.charCodeAt(cursor) === PERCENTAGE_SIGN) {
			cursor += 1;
			representationEnd = cursor - 1;

			return [
				TokenType.Percentage,
				source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					value: numberValue,
					signCharacter: signCharacter,
				},
			];
		}

		return [
			TokenType.Number,
			source.slice(representationStart, representationEnd + 1),
			representationStart,
			representationEnd,
			{
				value: numberValue,
				signCharacter: signCharacter,
				type: numberType,
			},
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
	function consumeIdentLikeToken(): CSSToken {
		const ident = consumeIdentSequence();

		if (source.charCodeAt(cursor) !== LEFT_PARENTHESIS) {
			return [
				TokenType.Ident,
				// For plain idents the decoded value is the raw source substring, so the
				// token text can reuse it instead of slicing the source again.
				identIsPlainRepr ? ident : source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					value: ident,
				},
			];
		}

		if (
			ident.length === 3 &&
			(
				ident.charCodeAt(0) === LATIN_SMALL_LETTER_U ||
				ident.charCodeAt(0) === LATIN_CAPITAL_LETTER_U
			) &&
			(
				ident.charCodeAt(1) === LATIN_SMALL_LETTER_R ||
				ident.charCodeAt(1) === LATIN_CAPITAL_LETTER_R
			) &&
			(
				ident.charCodeAt(2) === LATIN_SMALL_LETTER_L ||
				ident.charCodeAt(2) === LATIN_CAPITAL_LETTER_L
			)
		) {
			cursor += 1;
			representationEnd = cursor - 1;

			// Consume as much whitespace as possible, remembering how many code points were skipped.
			let whitespaceSkipped = 0;
			while (isWhitespace(source.charCodeAt(cursor))) {
				whitespaceSkipped += 1;
				cursor += 1;
				representationEnd = cursor - 1;
			}

			// If the first non-whitespace code point is a quote, this is a function token.
			// https://github.com/w3c/csswg-drafts/issues/8280#issuecomment-1370566921
			const firstNonWhitespace = source.charCodeAt(cursor);
			if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
				if (whitespaceSkipped > 0) {
					cursor -= whitespaceSkipped;
					representationEnd = cursor - 1;
				}

				return [
					TokenType.Function,
					source.slice(representationStart, representationEnd + 1),
					representationStart,
					representationEnd,
					{
						value: ident,
					},
				];
			}

			// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
			return consumeUrlToken();
		}

		cursor += 1;
		representationEnd = cursor - 1;
		return [
			TokenType.Function,
			source.slice(representationStart, representationEnd + 1),
			representationStart,
			representationEnd,
			{
				value: ident,
			},
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
	function consumeHashToken(): CSSToken {
		cursor += 1;
		representationEnd = cursor - 1;

		const hashCodePoint = source.charCodeAt(cursor);
		if (
			// An ident code point is a letter, a digit, an underscore, a hyphen or a non-ASCII ident code point.
			// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
			(
				(hashCodePoint >= 0x0041 && hashCodePoint <= 0x005a) || // A .. Z
				(hashCodePoint >= 0x0061 && hashCodePoint <= 0x007a) || // a .. z
				(hashCodePoint >= 0x0030 && hashCodePoint <= 0x0039) || // 0 .. 9
				hashCodePoint === HYPHEN_MINUS ||
				hashCodePoint === LOW_LINE ||
				isNonASCII_IdentCodePoint(hashCodePoint)
			) ||
			(hashCodePoint === REVERSE_SOLIDUS && !isNewLine(source.codePointAt(cursor + 1) ?? -1))
		) {
			let hashType = HashType.Unrestricted;

			if (checkIfThreeCodePointsWouldStartAnIdentSequence()) {
				hashType = HashType.ID;
			}

			const identSequence = consumeIdentSequence();
			return [
				TokenType.Hash,
				source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					value: identSequence,
					type: hashType,
				},
			];
		}

		return [
			TokenType.Delim,
			'#',
			representationStart,
			representationEnd,
			{
				value: '#',
			},
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
	function consumeAtKeywordToken(): CSSToken {
		cursor += 1;
		representationEnd = cursor - 1;

		if (checkIfThreeCodePointsWouldStartAnIdentSequence()) {
			const identSequence = consumeIdentSequence();

			return [
				TokenType.AtKeyword,
				source.slice(representationStart, representationEnd + 1),
				representationStart,
				representationEnd,
				{
					value: identSequence,
				},
			];
		}

		return [
			TokenType.Delim,
			'@',
			representationStart,
			representationEnd,
			{
				value: '@',
			},
		];
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
	function consumeInvalidEscapeToken(): CSSToken {
		cursor += 1;
		representationEnd = cursor - 1;

		const token: CSSToken = [TokenType.Delim, '\\', representationStart, representationEnd, {
			value: '\\',
		}];

		onParseError(new ParseErrorWithToken(
			ParseErrorMessage.InvalidEscapeSequenceAfterBackslash,
			representationStart,
			representationEnd,
			[
				'4.3.1. Consume a token',
				'U+005C REVERSE SOLIDUS (\\)',
				'The input stream does not start with a valid escape sequence',
			],
			token
		));

		return token;
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier
	//
	// Check the three code points starting at the current cursor position.
	function checkIfThreeCodePointsWouldStartAnIdentSequence(firstCodePoint?: number): boolean {
		const codePoint = typeof firstCodePoint === "undefined" ? source.charCodeAt(cursor) : firstCodePoint;

		// U+002D HYPHEN-MINUS
		if (codePoint === HYPHEN_MINUS) {
			// If the second code point is a U+002D HYPHEN-MINUS return true
			if (source.charCodeAt(cursor + 1) === HYPHEN_MINUS) {
				return true;
			}

			// If the second code point is an ident-start code point return true
			if (isIdentStartCodePoint(source.charCodeAt(cursor + 1))) {
				return true;
			}

			// If the second and third code points are a valid escape return true
			if (source.charCodeAt(cursor + 1) === REVERSE_SOLIDUS && !isNewLine(source.charCodeAt(cursor + 2))) {
				return true;
			}

			return false;
		}

		// ident-start code point
		// Return true.
		if (isIdentStartCodePoint(codePoint)) {
			return true;
		}

		// U+005C REVERSE SOLIDUS (\)
		return source.charCodeAt(cursor) === REVERSE_SOLIDUS && !isNewLine(source.charCodeAt(cursor + 1));
	}

	// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
	function checkIfThreeCodePointsWouldStartANumber(firstCodePoint: number): boolean {
		if (firstCodePoint === PLUS_SIGN || firstCodePoint === HYPHEN_MINUS) { // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
			// If the second code point is a digit, return true.
			if (source.charCodeAt(cursor + 1) >= 0x0030 && source.charCodeAt(cursor + 1) <= 0x0039) {
				return true;
			}

			// Otherwise, if the second code point is a U+002E FULL STOP (.)
			if (source.charCodeAt(cursor + 1) === FULL_STOP) {
				// and the third code point is a digit, return true.
				return source.charCodeAt(cursor + 2) >= 0x0030 && source.charCodeAt(cursor + 2) <= 0x0039;
			}

			// Otherwise, return false.
			return false;

		} else if (firstCodePoint === FULL_STOP) { // U+002E FULL STOP (.)
			// If the second code point is a digit, return true.
			// Otherwise, return false.
			return source.charCodeAt(cursor + 1) >= 0x0030 && source.charCodeAt(cursor + 1) <= 0x0039;
		}

		return firstCodePoint >= 0x0030 && firstCodePoint <= 0x0039; // digit
	}

	function endOfFile(): boolean {
		return cursor >= source.length;
	}

	function nextToken(): CSSToken {
		// Reset the token representation to the current cursor position.
		representationStart = cursor;
		representationEnd = -1;

		if (cursor >= source.length) {
			return [TokenType.EOF, '', -1, -1, undefined];
		}

		const peeked = source.charCodeAt(cursor);

		// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
		if (peeked === SOLIDUS && source.charCodeAt(cursor + 1) === ASTERISK) {
			return consumeComment();
		}

		// https://drafts.csswg.org/css-syntax/#starts-a-unicode-range
		if (
			unicodeRangesAllowed && (
				peeked === LATIN_SMALL_LETTER_U ||
				peeked === LATIN_CAPITAL_LETTER_U
			) &&
			source.codePointAt(cursor + 1) === PLUS_SIGN &&
			(
				source.codePointAt(cursor + 2) === QUESTION_MARK ||
				isHexDigitCodePoint(source.codePointAt(cursor + 2) ?? -1)
			)
		) {
			return consumeUnicodeRangeToken();
		}

		// Ident-like and numeric tokens are consumed directly; the remaining code points are
		// handled as simple, one-character tokens.
		if (isIdentStartCodePoint(peeked)) {
			return consumeIdentLikeToken();
		} else if (isDigitCodePoint(peeked)) {
			return consumeNumericToken();
		} else {
			// Simple, one character tokens:
			switch (peeked) {
				case COMMA:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Comma, ',', representationStart, representationEnd, undefined];

				case COLON:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Colon, ':', representationStart, representationEnd, undefined];

				case SEMICOLON:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Semicolon, ';', representationStart, representationEnd, undefined];

				case LEFT_PARENTHESIS:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.OpenParen, '(', representationStart, representationEnd, undefined];

				case RIGHT_PARENTHESIS:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.CloseParen, ')', representationStart, representationEnd, undefined];

				case LEFT_SQUARE_BRACKET:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.OpenSquare, '[', representationStart, representationEnd, undefined];

				case RIGHT_SQUARE_BRACKET:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.CloseSquare, ']', representationStart, representationEnd, undefined];

				case LEFT_CURLY_BRACKET:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.OpenCurly, '{', representationStart, representationEnd, undefined];

				case RIGHT_CURLY_BRACKET:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.CloseCurly, '}', representationStart, representationEnd, undefined];

				case APOSTROPHE:
				case QUOTATION_MARK:
					// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
					return consumeStringToken();

				case NUMBER_SIGN:
					// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
					return consumeHashToken();

				case PLUS_SIGN:
				case FULL_STOP:
					if (checkIfThreeCodePointsWouldStartANumber(peeked)) {
						return consumeNumericToken();
					}

					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Delim, source[representationStart], representationStart, representationEnd, {
						value: source[representationStart],
					}];

				case LINE_FEED:
				case CARRIAGE_RETURN:
				case FORM_FEED:
				case CHARACTER_TABULATION:
				case SPACE:
					// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
					{
						let whiteSpaceCodeUnit = source.charCodeAt(cursor);
						while (
							whiteSpaceCodeUnit === SPACE ||
							whiteSpaceCodeUnit === LINE_FEED ||
							whiteSpaceCodeUnit === CHARACTER_TABULATION ||
							whiteSpaceCodeUnit === CARRIAGE_RETURN ||
							whiteSpaceCodeUnit === FORM_FEED
						) {
							cursor += 1;
							whiteSpaceCodeUnit = source.charCodeAt(cursor);
						}
						representationEnd = cursor - 1;
					}

					return [
						TokenType.Whitespace,
						source.slice(representationStart, representationEnd + 1),
						representationStart,
						representationEnd,
						undefined,
					];

				case HYPHEN_MINUS:
					if (checkIfThreeCodePointsWouldStartANumber(peeked)) {
						return consumeNumericToken();
					}

					if (source.charCodeAt(cursor + 1) === HYPHEN_MINUS && source.charCodeAt(cursor + 2) === GREATER_THAN_SIGN) { // CDC
						cursor += 3;
						representationEnd = cursor - 1;

						return [TokenType.CDC, '-->', representationStart, representationEnd, undefined];
					}

					if (checkIfThreeCodePointsWouldStartAnIdentSequence(peeked)) {
						return consumeIdentLikeToken();
					}

					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Delim, '-', representationStart, representationEnd, {
						value: '-',
					}];

				case LESS_THAN_SIGN:
					if (source.charCodeAt(cursor + 1) === EXCLAMATION_MARK && source.charCodeAt(cursor + 2) === HYPHEN_MINUS && source.charCodeAt(cursor + 3) === HYPHEN_MINUS) { // CDO
						cursor += 4;
						representationEnd = cursor - 1;

						return [TokenType.CDO, '<!--', representationStart, representationEnd, undefined];
					}

					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Delim, '<', representationStart, representationEnd, {
						value: '<',
					}];

				case COMMERCIAL_AT:
					// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
					return consumeAtKeywordToken();

				case REVERSE_SOLIDUS:
					if (peeked === REVERSE_SOLIDUS && !isNewLine(source.charCodeAt(cursor + 1))) {
						return consumeIdentLikeToken();
					}

					// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
					return consumeInvalidEscapeToken();

				default:
					cursor += 1;
					representationEnd = cursor - 1;
					return [TokenType.Delim, source[representationStart], representationStart, representationEnd, {
						value: source[representationStart],
					}];
			}
		}
	}

	return {
		nextToken: nextToken,
		endOfFile: endOfFile,
	};
}

function noop(): void { /* do nothing */ }
