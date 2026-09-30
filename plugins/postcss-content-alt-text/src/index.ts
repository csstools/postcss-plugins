import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import type { PluginCreator } from 'postcss';
import { transform } from './transform';
import { parse } from './parse';

/** postcss-content-alt-text plugin options */
export type basePluginOptions = {
	/** Preserve the original notation. default: true */
	preserve: boolean,
	/** Strip alt text */
	stripAltText: boolean,
};

const predicate = {
	test: (str: string): boolean => {
		return str.includes('content:') && str.includes('/');
	}
};

const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-content-alt-text',
		Declaration(decl): void {
			if (decl.prop !== 'content' || !decl.value.includes('/')) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, predicate)) {
				return;
			}

			const parts = parse(decl.value);
			if (parts.length !== 2) {
				return;
			}

			const modified = transform(parts, opts?.stripAltText);

			if (modified === decl.value) {
				return;
			}

			decl.cloneBefore({ value: modified });

			if (opts?.preserve === false) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;


/** postcss-content-alt-text plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Strip alt text */
	stripAltText?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
		stripAltText: false,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-content-alt-text',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin(options),
			],
		};
	}

	return basePlugin(options);
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
