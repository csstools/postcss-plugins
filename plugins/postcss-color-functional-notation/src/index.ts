import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import valueParser from 'postcss-value-parser';
import type { ParsedValue, FunctionNode } from 'postcss-value-parser';
import type { Declaration, Result } from 'postcss';
import onCSSFunction from './on-css-function';

import type { PluginCreator } from 'postcss';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { hasFallback } from './has-fallback-decl';

type basePluginOptions = {
	preserve: boolean,
}

const HAS_COLOR_FUNCTION = /(?:rgb|hsl)a?\(/i;

/* Transform the color functional notation in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-function',
		Declaration: (decl: Declaration, { result }: { result: Result }) => {
			const originalValue = decl.value;
			if (!HAS_COLOR_FUNCTION.test(originalValue)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			let valueAST: ParsedValue | undefined;

			try {
				valueAST = valueParser(originalValue);
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${originalValue}' as a hsl or rgb function. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				return;
			}

			valueAST.walk((node) => {
				if (!node.type || node.type !== 'function') {
					return;
				}

				const lowerCaseNodeValue = node.value.toLowerCase();

				if (
					lowerCaseNodeValue !== 'hsl' &&
					lowerCaseNodeValue !== 'hsla' &&
					lowerCaseNodeValue !== 'rgb' &&
					lowerCaseNodeValue !== 'rgba'
				) {
					return;
				}

				onCSSFunction(node as FunctionNode);
			});
			const modifiedValue = String(valueAST);

			if (modifiedValue === originalValue) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!opts?.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** postcss-color-functional-notation plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the color() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-color-function',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin(options),
			],
		};
	}

	return basePlugin(options);
};

postcssPlugin.postcss = true;

export default postcssPlugin;
