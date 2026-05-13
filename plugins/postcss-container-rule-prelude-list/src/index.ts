import { parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-container-rule-prelude-list plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-container-rule-prelude-list',
		AtRule(rule): void {
			if (!rule.params.includes(',')) {
				return;
			}

			const list = parseCommaSeparatedListOfComponentValues(tokenize({ css: rule.params })).map((x) => stringify([x]));
			if (list.length <= 1) {
				return;
			}

			list.forEach((item) => {
				rule.cloneBefore({ params: item.trim() });
			});

			if (!options.preserve) {
				rule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
