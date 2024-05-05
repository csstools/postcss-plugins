import type { AtRule, Container, Document, PluginCreator, Rule } from 'postcss';
import type { CSSToken } from '@csstools/css-tokenizer';
import { isTokenWhiteSpaceOrComment, tokenize } from '@csstools/css-tokenizer';

const HAS_LEGAL_KEYWORDS_REGEX = /(?:license|copyright)/i;
const HAS_SOURCE_MAP_REGEX = /sourceMappingURL/i;
const HAS_WHITESPACE_OR_COMMENTS_REGEX = /(?:\s|\/\*)/;
const IS_LAYER_REGEX = /^layer$/i;

function minify(cache: Map<string, string>, x: string | undefined): string | undefined {
	if (!x) {
		return x;
	}

	if (cache.has(x)) {
		return cache.get(x);
	}

	const y = x.trim();
	if (y === '') {
		cache.set(x, '');
		return '';
	}

	if (!HAS_WHITESPACE_OR_COMMENTS_REGEX.test(y)) {
		cache.set(x, y);
		return y;
	}

	const tokens = tokenize({ css: y });

	let lastWasWhitespace = false;
	let token: CSSToken;
	for (let i = 0; i < tokens.length; i++) {
		token = tokens[i];
		if (isTokenWhiteSpaceOrComment(token)) {
			if (lastWasWhitespace) {
				token[1] = '';
			} else {
				token[1] = ' ';
			}

			lastWasWhitespace = true;
		} else {
			lastWasWhitespace = false;
		}
	}

	let minified = '';
	for (let i = 0; i < tokens.length; i++) {
		minified = minified + tokens[i][1];
	}

	cache.set(x, minified);

	return minified;
}

function removeEmptyNodes(node: Container | Document): boolean {
	if (node.type === 'rule') {
		if (node.nodes?.length === 0) {
			const parent = node.parent;
			if (!parent) {
				return false;
			}

			node.remove();
			removeEmptyNodes(parent);

			return true;
		}

	} else if (node.type === 'atrule') {
		if (node.nodes?.length === 0 && !IS_LAYER_REGEX.test((node as AtRule).name)) {
			const parent = node.parent;
			if (!parent) {
				return false;
			}

			node.remove();
			removeEmptyNodes(parent);

			return true;
		}
	}

	return false;
}

function setSemicolon(node: AtRule | Rule): void {
	if (node.raws.semicolon) {
		const last = node.last;
		if (last?.type !== 'decl' || !last.variable) {
			node.raws.semicolon = false;
		}
	}
}

/** postcss-minify plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	const cache = new Map<string, string>();

	return {
		postcssPlugin: 'postcss-minify',
		OnceExit(css): void {
			css.raws.before = '';
			css.raws.after = '\n';

			css.walk((node) => {
				switch (node.type) {
					case 'atrule':
						if (removeEmptyNodes(node)) {
							return;
						}

						node.raws.after = '';
						node.raws.afterName = ' ';
						node.raws.before = '';
						node.raws.between = '';
						node.raws.params = undefined;

						setSemicolon(node);

						node.params = minify(cache, node.params)!;

						return;

					case 'rule':

						if (removeEmptyNodes(node)) {
							return;
						}

						node.raws.after = '';
						node.raws.before = '';
						node.raws.between = '';
						node.raws.selector = undefined;

						setSemicolon(node);

						node.selector = minify(cache, node.selector)!;

						return;

					case 'decl':

						if (node.prop.startsWith('--')) {
							node.raws.before = '';

							// never minify or modify variables
							// browsers and CSSOM in particular handle these differently
							return;
						}

						node.raws.before = '';
						node.raws.between = ':';
						node.raws.important = node.important ? '!important' : '';
						node.raws.value = undefined;

						node.value = minify(cache, node.value)!;

						return;

					case 'comment':

						if (
							// `/*! ... */` is a common pattern to indicate that a comment is important and should not be removed.
							node.text.startsWith('!') ||
							// Comments containing the words `license` or `copyright` should not be removed.
							HAS_LEGAL_KEYWORDS_REGEX.test(node.text) ||
							// Comments containing the word `sourceMappingURL` should not be removed.
							HAS_SOURCE_MAP_REGEX.test(node.text)
						) {
							node.raws.before = '';
							return;
						}

						node.remove();

						return;

					default:
						break;
				}
			});
		},
	};
};

creator.postcss = true;

export default creator;
