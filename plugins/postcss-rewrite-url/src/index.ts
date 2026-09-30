import type { AtRule, Declaration, PluginCreator, Result } from 'postcss';
import { isTokenString, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { serializeString } from './serialize-string';

export interface ValueToRewrite {
	url: string;
	urlModifiers: Array<string>;
}

export interface RewriteContext {
	type: 'declaration-value' | 'at-rule-prelude';
	from: string | undefined;
	rootFrom: string | undefined;
	property?: string;
	atRuleName?: string;
}

export type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite | false;

/** postcss-rewrite-url plugin options */
export type pluginOptions = {
	rewriter: Rewriter;
};

const URL_FUNCTION_CALL_REGEX = /rewrite-url\(/i;
const URL_FUNCTION_NAME_REGEX = /^rewrite-url$/i;

const creator: PluginCreator<pluginOptions> = (options?: pluginOptions) => {
	const rewriter: Rewriter = options?.rewriter ?? ((x: ValueToRewrite): ValueToRewrite => {
		return x;
	});

	return {
		postcssPlugin: 'postcss-rewrite-url',
		Once(root, { result }): void {
			root.walkDecls((decl) => {
				rewriteDeclaration(decl, result, rewriter);
			});

			root.walkAtRules((atRule) => {
				rewriteAtRule(atRule, result, rewriter);
			});
		},
		Declaration(decl, { result }): void {
			rewriteDeclaration(decl, result, rewriter);
		},
		AtRule(atRule, { result }): void {
			rewriteAtRule(atRule, result, rewriter);
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };

function rewriteDeclaration(decl: Declaration, result: Result, rewriter: Rewriter): void {
	if(!URL_FUNCTION_CALL_REGEX.test(decl.value)) {
		return;
	}

	const context: RewriteContext = {
		type: 'declaration-value',
		rootFrom: result.opts.from,
		from: decl.source?.input.from,
		property: decl.prop,
	};

	const modifiedValue = rewrite(rewriter, decl.value, context);
	if (modifiedValue !== decl.value) {
		decl.value = modifiedValue;
	}
}

function rewriteAtRule(atRule: AtRule, result: Result, rewriter: Rewriter): void {
	if(!URL_FUNCTION_CALL_REGEX.test(atRule.params)) {
		return;
	}

	const context: RewriteContext = {
		type: 'at-rule-prelude',
		rootFrom: result.opts.from,
		from: atRule.source?.input.from,
		atRuleName: atRule.name,
	};

	const modifiedParams = rewrite(rewriter, atRule.params, context);
	if (modifiedParams !== atRule.params) {
		atRule.params = modifiedParams;
	}
}

function rewrite(rewriter: Rewriter, value: string, context: RewriteContext): string {
	const componentValuesList = parseCommaSeparatedListOfComponentValues(tokenize({ css: value }));
	const modifiedComponentValuesList = replaceComponentValues(
		componentValuesList,
		(componentValue) => {
			if (
				!isFunctionNode(componentValue) ||
				!URL_FUNCTION_NAME_REGEX.test(componentValue.getName())
			) {
				return;
			}

			const rewriteArguments = componentValue.value.filter((x) => !isWhiteSpaceOrCommentNode(x));

			for (let i = 0; i < rewriteArguments.length; i++) {
				const x = rewriteArguments[i];

				if (isTokenNode(x) && isTokenString(x.value)) {
					const original = x.value[4].value.trim();
					const urlModifiers = rewriteArguments.slice(i + 1);

					const modified = rewriter({ url: original, urlModifiers: urlModifiers.map((y) => y.toString()) }, context);
					if (modified === false) {
						return;
					}

					const modifiedArguments = parseListOfComponentValues(
						tokenize({
							css: [
								`"${serializeString(modified.url)}"`,
								...(modified.urlModifiers ?? urlModifiers)
							].join(' ')
						})
					);

					componentValue.value = modifiedArguments;
					componentValue.name[1] = 'url(';
					componentValue.name[4].value = 'url';

					return componentValue;
				}

				return;
			}
		},
	);

	return stringify(modifiedComponentValuesList);
}
