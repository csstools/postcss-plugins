import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';

type basePluginOptions = {
	preserve: boolean,
}

const basePlugin: PluginCreator<basePluginOptions> = (opts: basePluginOptions) => {
	const icMatch = new RegExp(/^(\d+|\d+\.*\d*|\.*\d+)ic$/);

	return {
		postcssPlugin: 'postcss-ic-unit',
		Declaration(decl) {
			if (!decl.value.includes('ic')) {
				return;
			}

			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (!node.type || node.type !== 'word') {
					return;
				}

				node.value = node.value.replace(icMatch, '$1em');
			});

			const modifiedValue = String(parsedValue);

			if (modifiedValue !== decl.value) {
				if (opts.preserve) {
					decl.cloneBefore({ value: modifiedValue });
				} else {
					decl.value = modifiedValue;
				}
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
