import { isTokenNode, parseListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { isTokenDelim, tokenize } from '@csstools/css-tokenizer';
import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import type { PluginCreator } from 'postcss';

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
}

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

			const componentValues = parseListOfComponentValues(
				tokenize({ css: decl.value })
			);

			let slashCounter = 0;

			for (let i = (componentValues.length - 1); i >= 0; i--) {
				const componentValue = componentValues[i];
				if (!isTokenNode(componentValue)) {
					continue;
				}

				const token = componentValue.value;
				if (!isTokenDelim(token)) {
					continue;
				}

				if (token[4].value !== '/') {
					continue;
				}

				slashCounter++;

				if (opts?.stripAltText === true) {
					componentValues.splice(i, componentValues.length);
				} else {
					componentValues.splice(i, 1);
				}
			}

			if (slashCounter !== 1) {
				// Either too few or too many slashes
				return;
			}

			const modified = stringify([componentValues]);

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
