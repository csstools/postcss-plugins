import { parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import type { PluginCreator } from 'postcss';

/** postcss-property-rule-prelude-list plugin options */
export type pluginOptions = never;

const IS_AT_PROPERTY_REGEX = /^property$/i;

// A comma separated prelude is expanded by cloning the whole at-rule (including
// its children) once per list item. When such rules are nested, the clones are
// expanded again and the output grows exponentially with the nesting depth.
// Bound the total number of at-rules generated per stylesheet.
const MAX_EXPANDED_AT_RULES = 5_000;

const creator: PluginCreator<pluginOptions> = () => {
	let expandedAtRules = 0;

	return {
		postcssPlugin: 'postcss-property-rule-prelude-list',
		Once(): void {
			expandedAtRules = 0;
		},
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

			expandedAtRules += list.length;
			if (expandedAtRules > MAX_EXPANDED_AT_RULES) {
				throw new Error('Maximum @property expansion size exceeded, reduce the complexity of your stylesheet');
			}

			list.forEach((params) => {
				atRule.cloneBefore({
					params: stringify([params]).trim(),
				});
			});

			atRule.remove();
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
