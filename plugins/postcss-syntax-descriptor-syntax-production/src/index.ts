import { isTokenComment, isTokenEOF, isTokenString, isTokenWhitespace, isTokenWhiteSpaceOrComment, tokenize } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-syntax-descriptor-syntax-production plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const IS_AT_PROPERTY_REGEX = /^property$/i;
const IS_SYNTAX_REGEX = /^syntax$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-syntax-descriptor-syntax-production',
		Declaration(decl): void {
			if (!IS_SYNTAX_REGEX.test(decl.prop)) {
				return;
			}

			if (!decl.parent || decl.parent.type !== 'atrule') {
				return;
			}

			if (!IS_AT_PROPERTY_REGEX.test(decl.parent.name)) {
				return;
			}

			const prev = decl.prev();
			if (prev && prev.type === 'decl' && IS_SYNTAX_REGEX.test(prev.prop)) {
				return;
			}

			const originalValue = decl.value;
			const tokens = tokenize({ css: decl.value });

			const meaningfulTokens = tokens.filter((x) => {
				return !(isTokenWhiteSpaceOrComment(x) || isTokenEOF(x));
			});

			if (meaningfulTokens.length === 1 && isTokenString(meaningfulTokens[0])) {
				return;
			}

			let stringValue = '';
			tokens.forEach((token) => {
				if (isTokenComment(token)) return;

				if (isTokenWhitespace(token)) {
					stringValue += " ";
					return;
				}

				stringValue += token[1];
			});

			let serialized = '"';

			for (const part of stringValue) {
				const codePoint = part.codePointAt(0);
				if (typeof codePoint === "undefined") {
					continue;
				}

				switch (codePoint) {
					case 0x0000:
						serialized += String.fromCodePoint(0xFFFD);
						break;
					case 0x0022:
					case 0x005C:
						serialized += ("\\" + String.fromCodePoint(codePoint));
						break;
					case 0x0001:
					case 0x0002:
					case 0x0003:
					case 0x0004:
					case 0x0005:
					case 0x0006:
					case 0x0007:
					case 0x0008:
					case 0x0009:
					case 0x000A:
					case 0x000B:
					case 0x000C:
					case 0x000D:
					case 0x000E:
					case 0x000F:
					case 0x0010:
					case 0x0011:
					case 0x0012:
					case 0x0013:
					case 0x0014:
					case 0x0015:
					case 0x0016:
					case 0x0017:
					case 0x0018:
					case 0x0019:
					case 0x001A:
					case 0x001B:
					case 0x001C:
					case 0x001D:
					case 0x001E:
					case 0x001F:
					case 0x007F:
						serialized += ("\\" + codePoint.toString(16) + " ");
						break;

					default:
						serialized += String.fromCodePoint(codePoint);
						break;
				}
			}

			serialized += '"';

			if (originalValue === serialized) {
				return;
			}

			decl.cloneBefore({
				value: serialized,
			});

			if (options.preserve) {
				return;
			}

			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
