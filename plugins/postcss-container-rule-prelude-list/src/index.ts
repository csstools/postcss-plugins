import { parseCommaSeparatedListOfComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import type { AtRule, PluginCreator } from 'postcss';

const CONTAINER_NAME_REGEX = /^container$/i;

// A comma separated prelude is expanded by cloning the whole at-rule (including
// its children) once per list item. When such rules are nested, the clones are
// expanded again and the output grows exponentially with the nesting depth.
// Bound the total number of at-rules generated per stylesheet.
const MAX_EXPANDED_AT_RULES = 10_000;

function countAtRules(node: AtRule): number {
	let count = 1;
	node.walkAtRules(() => {
		count++;
	});

	return count;
}

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

	let expandedAtRules = 0;

	return {
		postcssPlugin: 'postcss-container-rule-prelude-list',
		Once(): void {
			expandedAtRules = 0;
		},
		AtRule(rule): void {
			if (!CONTAINER_NAME_REGEX.test(rule.name)) {
				return;
			}

			if (!rule.params.includes(',')) {
				return;
			}

			const list = parseCommaSeparatedListOfComponentValues(tokenize({ css: rule.params })).map((x) => stringify([x]));
			if (list.length <= 1) {
				return;
			}

			expandedAtRules += list.length * countAtRules(rule);
			if (expandedAtRules > MAX_EXPANDED_AT_RULES) {
				throw new Error('Maximum @container expansion size exceeded, reduce the complexity of your stylesheet');
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
