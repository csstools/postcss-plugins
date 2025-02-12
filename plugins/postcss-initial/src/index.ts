import type { PluginCreator } from 'postcss';
import { allProperties, properties } from './properties';
import { hasExactFallback } from './has-fallback-decl';

/** postcss-initial plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const IS_INITIAL_REGEX = /^\s?initial\s?$/i;
const IS_FONT_REGEX = /^font$/i;
const IS_ALL_REGEX = /^all$/i;

const fontProperties = [
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font-stretch',
	'line-height',
];

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-initial',
		Declaration(decl): void {
			if (decl.variable) {
				return;
			}

			if (!IS_INITIAL_REGEX.test(decl.value)) {
				return;
			}

			let lookupProperties;
			if (IS_FONT_REGEX.test(decl.prop)) {
				lookupProperties = fontProperties;
			} else if (IS_ALL_REGEX.test(decl.prop)) {
				lookupProperties = allProperties;
			} else {
				lookupProperties = [decl.prop.toLowerCase()];
			}

			let didReplace = false;

			lookupProperties.forEach((prop) => {
				const replacement = properties.get(prop);
				if (!replacement) {
					return;
				}

				if (hasExactFallback(decl, replacement)) {
					return;
				}

				didReplace = true;

				decl.cloneBefore({
					prop: prop,
					value: replacement,
				});
			});

			if (!options.preserve && didReplace) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
