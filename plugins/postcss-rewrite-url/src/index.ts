import type { PluginCreator } from 'postcss';
import { TokenType, tokenize } from '@csstools/css-tokenizer';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { serializeString } from './serialize-string';

export interface ValueToRewrite {
	url: string
}

export interface RewriteContext {
	from: string | undefined;
	rootFrom: string | undefined;
}

export type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite;

/** postcss-rewrite-url plugin options */
export type pluginOptions = {
	rewriter: Rewriter;
};

const URL_FUNCTION_CALL_REGEX = /rewrite-url\(/i;
const URL_FUNCTION_NAME_REGEX = /^rewrite-url$/i;

const creator: PluginCreator<pluginOptions> = (options?: pluginOptions) => {
	const rewriter: Rewriter = options?.rewriter ?? ((x) => {
		return x;
	});

	return {
		postcssPlugin: 'postcss-rewrite-url',
		prepare() {
			return {
				Declaration(decl, { result }) {
					if (!URL_FUNCTION_CALL_REGEX.test(decl.value)) {
						return;
					}

					const rewriteContext: RewriteContext = {
						rootFrom: result.opts.from,
						from: decl.source?.input.from,
					};

					const componentValuesList = parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value }));
					const modifiedComponentValuesList = replaceComponentValues(
						componentValuesList,
						(componentValue) => {
							if (
								!isFunctionNode(componentValue) ||
								!URL_FUNCTION_NAME_REGEX.test(componentValue.getName())
							) {
								return;
							}

							for (const x of componentValue.value) {
								if (isWhitespaceNode(x) || isCommentNode(x)) {
									continue;
								}

								if (isTokenNode(x) && x.value[0] === TokenType.String) {
									const original = x.value[4].value.trim();
									const modified = rewriter({ url: original }, rewriteContext);
									if (modified.url === original) {
										break;
									}

									x.value[4].value = modified.url;
									x.value[1] = `"${serializeString(modified.url)}"`;

									componentValue.name[1] = 'url(';
									componentValue.name[4].value = 'url';

									return componentValue;
								}
							}
						},
					);

					const modifiedValue = stringify(modifiedComponentValuesList);
					if (modifiedValue !== decl.value) {
						decl.value = modifiedValue;
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
