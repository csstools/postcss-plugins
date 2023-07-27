import type { AtRule, Container, Document, PluginCreator } from 'postcss';
import { TokenType, stringify, tokenize } from '@csstools/css-tokenizer';

/** postcss-minify plugin options */
export type pluginOptions = never;

const HAS_LEGAL_KEYWORDS = /(?:license|copyright)/i;
const HAS_SOURCE_MAP = /sourceMappingURL/i;
const HAS_WHITESPACE_OR_COMMENTS = /(?:[\s]|\/\*)/;

function minify(x: string | undefined): string | undefined {
	if (!x || !HAS_WHITESPACE_OR_COMMENTS.test(x)) {
		return x;
	}

	if (x.trim() === '') {
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

	return stringify(...tokens);
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

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-minify',
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

				if (node.type === 'decl' && node.variable) {
					node.raws = {
						...node.raws,
						before: minify(node.raws?.before),
					};

					// never minify or modify variables
					// browsers and CSSOM in particular handle these differently
					return;
				}

				if (node.type === 'atrule') {

					if (removeEmptyNodes(node)) {
						return;
					}

					node.raws = {
						before: minify(node.raws?.before),
						after: minify(node.raws?.after),
						between: minify(node.raws?.between),
						semicolons: node.raws?.semicolons,
						afterName: minify(node.raws?.afterName),
					};

					node.params = minify(node.params)!;

					return;
				}

				if (node.type === 'rule') {

					if (removeEmptyNodes(node)) {
						return;
					}

					node.raws = {
						before: minify(node.raws?.before),
						after: minify(node.raws?.after),
						between: minify(node.raws?.between),
					};

					node.selector = minify(node.selector)!;

					return;
				}

				if (node.type === 'decl') {

					node.raws = {
						before: minify(node.raws?.before),
						between: minify(node.raws?.between),
						semicolons: node.raws?.semicolons,
						important: (node.type === 'decl' && node.important) ? '!important' : '',
					};

					node.value = minify(node.value)!;

				}
			});
		},
	};
};

creator.postcss = true;

export default creator;
