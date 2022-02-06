import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, Result } from 'postcss';
import type { PluginCreator } from 'postcss';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { modifiedValues } from './modified-value';

/** Transform color() function in CSS. */
const basePlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
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
			if (originalValue.indexOf('color(') === -1) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result);
			if (typeof modified === 'undefined') {
				return;
			}

			if (preserve) {
				decl.cloneBefore({ value: modified });
			} else {
				decl.value = modified;
			}
		},
	};
};

basePlugin.postcss = true;

/** Dynamically include "postcssProgressiveCustomProperties" only when needed. */
const postcssPlugin: PluginCreator<{ preserve?: boolean, enableProgressiveCustomProperties?: boolean }> = (opts?: { preserve?: boolean, enableProgressiveCustomProperties?: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	const enableProgressiveCustomProperties = 'enableProgressiveCustomProperties' in Object(opts) ? Boolean(opts.enableProgressiveCustomProperties) : true;

	if (enableProgressiveCustomProperties && preserve) {
		return {
			postcssPlugin: 'postcss-color-function',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin({ preserve: preserve }),
			],
		};
	}

	return basePlugin({ preserve: preserve });
};

postcssPlugin.postcss = true;

export default postcssPlugin;

