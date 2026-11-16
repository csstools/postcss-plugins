import type { AtRule, PluginCreator } from 'postcss';
import { collectMixinDefinitions, removeUnusedMixins } from './mixin-definitions';
import { MixinExpander } from './mixin-expander';

/** postcss-mixins plugin options */
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
		postcssPlugin: 'postcss-mixins',
		Once(root, helpers): void {
			const atRules: Array<AtRule> = [];
			root.walkAtRules((atRule) => {
				atRules.push(atRule);
			});

			const definitions = collectMixinDefinitions(atRules);
			const expander = new MixinExpander(definitions, options.preserve === true);

			expander.expandAll(root, helpers);
			expander.finish(root);

			if (!options.preserve) {
				removeUnusedMixins(root, definitions);
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
