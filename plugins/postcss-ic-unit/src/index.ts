import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';

type basePluginOptions = {
	preserve: boolean,
}

const HAS_IC_UNIT_REGEX = /ic\b/i;
const HAS_IC_DECLARATION_REGEX = /\(font-size: \d+ic\)/i;

const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-ic-unit',
		Declaration(decl): void {
			if (!HAS_IC_UNIT_REGEX.test(decl.value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, HAS_IC_DECLARATION_REGEX)) {
				return;
			}

			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (!node.type || node.type !== 'word') {
					return;
				}

				const dimension = valueParser.unit(node.value);

				if (dimension && dimension.unit.toLowerCase() === 'ic') {
					node.value = `${dimension.number}em`;
				}
			});

			const modifiedValue = String(parsedValue);

			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!opts?.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** postcss-ic-unit plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-ic-unit',
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
