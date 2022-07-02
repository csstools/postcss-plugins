import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, Result } from 'postcss';
import type { PluginCreator } from 'postcss';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { modifiedValues } from './modified-value';

type basePluginOptions = {
	preserve: boolean,
}

/** Transform color() function in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts: basePluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	return {
		postcssPlugin: 'postcss-color-function',
		Declaration: (decl: Declaration, { result }: { result: Result }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!originalValue.toLowerCase().includes('color(')) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result, preserve);
			if (typeof modified === 'undefined') {
				return;
			}

			decl.cloneBefore({ value: modified });

			if (!preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

type pluginOptions = {
	preserve?: boolean,
	enableProgressiveCustomProperties?: boolean,
}

/* Transform color() function in CSS. */
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

