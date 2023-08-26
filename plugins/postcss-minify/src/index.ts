import type { AtRule, Container, Document, PluginCreator, Rule } from 'postcss';
import { TokenType, stringify, tokenize } from '@csstools/css-tokenizer';

const HAS_LEGAL_KEYWORDS = /(?:license|copyright)/i;
const HAS_SOURCE_MAP = /sourceMappingURL/i;
const HAS_WHITESPACE_OR_COMMENTS = /(?:[\s]|\/\*)/;
const IS_LAYER = /^layer$/i;

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

	if (!HAS_WHITESPACE_OR_COMMENTS.test(y)) {
		cache.set(x, y);
		return y;
	}

	const tokens = tokenize({ css: y });

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (
			token[0] === TokenType.Comment ||
			token[0] === TokenType.Whitespace
		) {
			token[1] = ' ';

			let nextToken = tokens[i + 1];
			while (
				nextToken &&
				(
					nextToken[0] === TokenType.Comment ||
					nextToken[0] === TokenType.Whitespace
				)
			) {
				nextToken[1] = '';

				i++;
				nextToken = tokens[i + 1];
			}
		}
	}

	const minified = stringify(...tokens);
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
		if (node.nodes?.length === 0 && !IS_LAYER.test((node as AtRule).name)) {
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

function setSemicolon(node: AtRule | Rule) {
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
		OnceExit(css) {
			css.raws.before = '';
			css.raws.after = '\n';

			css.walk((node) => {
				if (node.type === 'comment') {
					if (HAS_LEGAL_KEYWORDS.test(node.text) || HAS_SOURCE_MAP.test(node.text)) {
						return;
					}

					node.remove();
					return;
				}

				if (node.type === 'atrule') {

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
				}

				if (node.type === 'rule') {

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
				}

				if (node.type === 'decl') {
					if (node.variable) {
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
				}
			});
		},
	};
};

creator.postcss = true;

export default creator;
