import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Plugin, PluginCreator } from 'postcss';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { PREFERS_CONTRAST, transformContrastColor } from './transform-contrast-color';

const CONTRAST_COLOR_FUNCTION_REGEX = /\bcontrast-color\(/i;

const basePlugin: PluginCreator<pluginOptions> = (opts) => {
	return {
		postcssPlugin: 'postcss-contrast-color-function',
		prepare(): Plugin {
			return {
				postcssPlugin: 'postcss-contrast-color-function',
				Declaration(decl, { atRule }): void {
					const parent = decl.parent;
					if (!parent) {
						return;
					}

					if (!CONTRAST_COLOR_FUNCTION_REGEX.test(decl.value)) {
						return;
					}

					if (hasFallback(decl)) {
						return;
					}

					if (hasSupportsAtRuleAncestor(decl, CONTRAST_COLOR_FUNCTION_REGEX)) {
						return;
					}

					const modifiedNoPreference = transformContrastColor(decl.value, PREFERS_CONTRAST.NO_PREFERENCE);
					if (modifiedNoPreference === decl.value) {
						return;
					}

					const modifiedLess = transformContrastColor(decl.value, PREFERS_CONTRAST.LESS);
					if (modifiedLess === decl.value) {
						return;
					}

					const modifiedMore = transformContrastColor(decl.value, PREFERS_CONTRAST.MORE);
					if (modifiedMore === decl.value) {
						return;
					}

					decl.cloneBefore({ value: modifiedNoPreference });

					if (modifiedNoPreference !== modifiedLess) {
						const parentClone = parent.clone();
						parentClone.removeAll();

						parentClone.append(decl.clone({ value: modifiedLess }));

						const prefers = atRule({ name: 'media', params: '(prefers-contrast: less)', source: parent.source });
						prefers.append(parentClone);

						if (!opts?.preserve) {
							parent.after(prefers);
						} else {
							const supports = atRule({ name: 'supports', params: 'not (color: contrast-color(red max))', source: parent.source });
							supports.append(prefers);

							parent.after(supports);
						}
					}

					if (modifiedNoPreference !== modifiedMore) {
						const parentClone = parent.clone();
						parentClone.removeAll();

						parentClone.append(decl.clone({ value: modifiedMore }));

						const prefers = atRule({ name: 'media', params: '(prefers-contrast: more)', source: parent.source });
						prefers.append(parentClone);

						if (!opts?.preserve) {
							parent.after(prefers);
						} else {
							const supports = atRule({ name: 'supports', params: 'not (color: contrast-color(red max))', source: parent.source });
							supports.append(prefers);

							parent.after(supports);
						}
					}

					if (!opts?.preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

basePlugin.postcss = true;

/** postcss-contrast-color-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the contrast-color() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-contrast-color-function',
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
