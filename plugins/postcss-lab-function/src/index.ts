import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, Result } from 'postcss';
import type { PluginCreator } from 'postcss';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { modifiedValues } from './modified-values';

type basePluginOptions = {
	preserve: boolean,
	subFeatures: {
		displayP3: boolean
	}
};

/* Transform lab() and lch() functions in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts: basePluginOptions) => {
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
			if (!(/(^|[^\w-])(lab|lch)\(/i.test(originalValue.toLowerCase()))) {
				return;
			}

			const modified = modifiedValues(originalValue, decl, result, opts.preserve);
			if (typeof modified === 'undefined') {
				return;
			}

			if (opts.preserve) {
				decl.cloneBefore({ value: modified.rgb });

				if (opts.subFeatures.displayP3) {
					decl.cloneBefore({ value: modified.displayP3 });
				}
			} else {
				decl.cloneBefore({ value: modified.rgb });

				if (opts.subFeatures.displayP3) {
					decl.cloneBefore({ value: modified.displayP3 });
				}

				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

type pluginOptions = {
	enableProgressiveCustomProperties?: boolean
	preserve?: boolean,
	subFeatures?: {
		displayP3?: boolean
	}
};

/* Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: false,
		subFeatures: {
			displayP3: true,
		},
	}, opts);

	// deep merge
	options.subFeatures = Object.assign({
		displayP3: true,
	}, options.subFeatures);

	if (options.enableProgressiveCustomProperties && (options.preserve || options.subFeatures.displayP3)) {
		return {
			postcssPlugin: 'postcss-lab-function',
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
