import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Plugin, PluginCreator, Source } from 'postcss';
import { DARK_PROP, LIGHT_PROP, OFF, ON } from './props';
import { colorSchemes } from './color-schemes';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { transformLightDark } from './transform-light-dark';

const COLOR_SCHEME_REGEX = /^color-scheme$/i;
const LIGHT_DARK_FUNCTION_REGEX = /\blight-dark\(/i;

const basePlugin: PluginCreator<pluginOptions> = (opts) => {
	return {
		postcssPlugin: 'postcss-light-dark-function',
		prepare(): Plugin {
			let didTransformValues = false;
			let transformedValueSource: Source | undefined = undefined;

			return {
				postcssPlugin: 'postcss-light-dark-function',
				Declaration(decl, { atRule, rule }): void {
					const parent = decl.parent;
					if (!parent) {
						return;
					}

					if (COLOR_SCHEME_REGEX.test(decl.prop)) {
						const [light, dark] = colorSchemes(decl.value);

						if (light && dark) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: ON });
							decl.cloneBefore({ prop: DARK_PROP, value: OFF });

							const parentClone = parent.clone();
							parentClone.removeAll();

							parentClone.append(decl.clone({ prop: LIGHT_PROP, value: OFF }));
							parentClone.append(decl.clone({ prop: DARK_PROP, value: ON }));

							const prefers = atRule({ name: 'media', params: '(prefers-color-scheme: dark)', source: parent.source });
							prefers.append(parentClone);

							parent.after(prefers);

							return;
						}

						if (dark) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: OFF });
							decl.cloneBefore({ prop: DARK_PROP, value: ON });

							return;
						}

						if (light) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: ON });
							decl.cloneBefore({ prop: DARK_PROP, value: OFF });

							return;
						}

						return;
					}

					if (LIGHT_DARK_FUNCTION_REGEX.test(decl.value)) {
						if (hasFallback(decl)) {
							return;
						}

						if (hasSupportsAtRuleAncestor(decl, LIGHT_DARK_FUNCTION_REGEX)) {
							return;
						}

						const modified = transformLightDark(decl.value);
						if (modified === decl.value) {
							return;
						}

						didTransformValues = true;
						if (!transformedValueSource) {
							transformedValueSource = decl.source;
						}

						decl.cloneBefore({ value: modified });

						if (decl.variable && decl.parent) {
							const variableInheritanceRule = rule({
								selector: '& *',
								source: decl.source,
							});

							variableInheritanceRule.append(decl.clone({ value: modified }));
							decl.parent.append(variableInheritanceRule);
						}

						if (!opts?.preserve) {
							decl.remove();
						}
					}
				},
				OnceExit(root, { atRule, rule, decl }): void {
					if (!didTransformValues || !transformedValueSource) {
						return;
					}

					const light = decl({ prop: LIGHT_PROP, value: ON });
					const dark = decl({ prop: DARK_PROP, value: OFF });
					light.source = transformedValueSource;
					dark.source = transformedValueSource;

					{
						const rootRule = rule({ selector: ':root', source: transformedValueSource });
						rootRule.append(light, dark);

						root.append(rootRule);
					}

					{
						const rootRule = rule({ selector: ':root', source: transformedValueSource });
						rootRule.append(light.clone({ value: OFF }), dark.clone({ value: ON }));

						const prefers = atRule({ name: 'media', params: '(prefers-color-scheme: dark)', source: transformedValueSource });
						prefers.append(rootRule);

						root.append(prefers);
					}
				},
			};
		},
	};
};

basePlugin.postcss = true;

/** postcss-light-dark-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the light-dark() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-light-dark-function',
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
