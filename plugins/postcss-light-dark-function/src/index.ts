import type { PluginCreator, Source } from 'postcss';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { colorSchemes } from './color-schemes';
import { transformLightDark } from './transform-light-dark';
import { DARK_PROP, LIGHT_PROP, OFF, ON } from './props';

/** postcss-light-dark-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const COLOR_SCHEME_REGEX = /color-scheme/i;
const LIGHT_DARK_FUNCTION_REGEX = /light-dark\(/i;

const creator: PluginCreator<pluginOptions> = (opts) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-light-dark-function',
		prepare() {
			let didTransformValues = false;
			let transformedValueSource: Source | undefined = undefined;

			return {
				Declaration(decl, { atRule }) {
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

						if (hasSupportsAtRuleAncestor(decl)) {
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

						if (!options.preserve) {
							decl.remove();
						}
					}
				},
				OnceExit(root, { atRule, rule, decl }) {
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

creator.postcss = true;

export default creator;
