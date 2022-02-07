import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, Result } from 'postcss';
import type { PluginCreator } from 'postcss';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { modifiedValues } from './modified-values';

/** Transform lab() and lch() functions in CSS. */
const basePlugin: PluginCreator<{ preserve: boolean, displayP3: boolean }> = (opts?: { preserve: boolean, displayP3: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	const displayP3Enabled = 'displayP3' in Object(opts) ? Boolean(opts.displayP3) : false;

	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration: (decl: Declaration, { result }: { result: Result }) => {
			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const originalValue = decl.value;
			if (!(/(^|[^\w-])(lab|lch)\(/i.test(originalValue))) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result, preserve);
			if (typeof modified === 'undefined') {
				return;
			}

			if (preserve) {
				decl.cloneBefore({ value: modified.rgb });

				if (displayP3Enabled) {
					decl.cloneBefore({ value: modified.displayP3 });
				}
			} else {
				decl.cloneBefore({ value: modified.rgb });

				if (displayP3Enabled) {
					decl.cloneBefore({ value: modified.displayP3 });
				}

				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<{ preserve?: boolean, displayP3?: boolean, enableProgressiveCustomProperties?: boolean }> = (opts?: { preserve?: boolean, displayP3?: boolean, enableProgressiveCustomProperties?: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;
	const displayP3Enabled = 'displayP3' in Object(opts) ? Boolean(opts.displayP3) : true;
	const enableProgressiveCustomProperties = 'enableProgressiveCustomProperties' in Object(opts) ? Boolean(opts.enableProgressiveCustomProperties) : true;

	if (enableProgressiveCustomProperties && (preserve || displayP3Enabled)) {
		return {
			postcssPlugin: 'postcss-color-function',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin({ preserve: preserve, displayP3: displayP3Enabled }),
			],
		};
	}

	return basePlugin({ preserve: preserve, displayP3: displayP3Enabled });
};

postcssPlugin.postcss = true;

export default postcssPlugin;
