import type { AtRule, Container, Document, PluginCreator } from 'postcss';
import { TokenType, stringify, tokenize } from '@csstools/css-tokenizer';

const HAS_LEGAL_KEYWORDS = /(?:license|copyright)/i;
const HAS_SOURCE_MAP = /sourceMappingURL/i;
const HAS_WHITESPACE_OR_COMMENTS = /(?:[\s]|\/\*)/;

function minify(cache: Map<string, string>, x: string | undefined): string | undefined {
	if (!x) {
		return x;
	}

	if (cache.has(x)) {
		return cache.get(x);
	}

	if (!HAS_WHITESPACE_OR_COMMENTS.test(x)) {
		cache.set(x, x);
		return x;
	}

	if (x.trim() === '') {
		cache.set(x, ' ');
		return ' ';
	}

	const tokens = tokenize({ css: x });

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
			node.remove();

			if (parent?.nodes?.length === 0) {
				removeEmptyNodes(parent);
			}

			return true;
		}

	} else if (node.type === 'atrule') {
		if (node.nodes?.length === 0 && (node as AtRule).name.toLowerCase() !== 'layer') {
			const parent = node.parent;
			node.remove();

			if (parent?.nodes?.length === 0) {
				removeEmptyNodes(parent);
			}

			return true;
		}
	}

	return false;
}

/** postcss-minify plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-minify',
		prepare() {
			const cache = new Map<string, string>();

			return {
				OnceExit(css) {
					css.raws = {
						before: '',
						after: '\n',
					};

					css.walk((node) => {
						if (node.type === 'comment') {
							if (HAS_LEGAL_KEYWORDS.test(node.text) || HAS_SOURCE_MAP.test(node.text)) {
								return;
							}

							node.remove();
							return;
						}

						if (node.type === 'decl') {
							if (node.variable) {
								node.raws.before = '';

								// never minify or modify variables
								// browsers and CSSOM in particular handle these differently
								return;
							}
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

							if (node.raws.semicolon) {
								const last = node.last;
								if (last?.type !== 'decl' || !last.variable) {
									node.raws.semicolon = false;
								}
							}

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

							if (node.raws.semicolon) {
								const last = node.last;
								if (last?.type !== 'decl' || !last.variable) {
									node.raws.semicolon = false;
								}
							}

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
							node.raws.semicolons = false;
							node.raws.value = undefined;

							node.value = minify(cache, node.value)!;
						}
					});
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
