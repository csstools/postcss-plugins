import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';

type basePluginOptions = {
	preserve: boolean,
}

const basePlugin: PluginCreator<basePluginOptions> = (opts: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-ic-unit',
		Declaration(decl) {
			if (!decl.value.toLowerCase().includes('ic')) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
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

			if (!opts.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

type pluginOptions = {
	preserve?: boolean,
	enableProgressiveCustomProperties?: boolean,
}

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
