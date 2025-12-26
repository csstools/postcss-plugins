import { parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-property-rule-prelude-list plugin options */
export type pluginOptions = never;

const IS_AT_PROPERTY_REGEX = /^property$/i;

const creator: PluginCreator<pluginOptions> = () => {

	return {
		postcssPlugin: 'postcss-property-rule-prelude-list',
		AtRule(atRule): void {
			if (!IS_AT_PROPERTY_REGEX.test(atRule.name)) {
				return;
			}

			if (!atRule.params.includes(',')) {
				return;
			}

			const list = parseCommaSeparatedListOfComponentValues(tokenize({ css: atRule.params }));
			if (list.length < 2) {
				return;
			}

			list.forEach((params) => {
				atRule.cloneBefore({
					params: stringify([params]).trim(),
				});
			})

			atRule.remove();
		},
	};
};

creator.postcss = true;

export default creator;
