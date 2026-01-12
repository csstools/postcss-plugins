import type { AtRule, Plugin, PluginCreator } from 'postcss';
import { IS_APPLY_REGEX, processableApplyRule } from './processable-apply';
import { processableMixinRule } from './processable-mixin';

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
		prepare(): Plugin {
			const mixins: Map<string, AtRule> = new Map();
			const knownMixins: Set<string> = new Set();

			return {
				postcssPlugin: 'mixins',
				Once(root): void {
					root.each((child) => {
						if (child.type !== 'atrule') {
							return;
						}

						const mixinName = processableMixinRule(child);
						if (!mixinName) {
							return;
						}

						// TODO: support mixin overrides
						if (knownMixins.has(mixinName)) {
							mixins.delete(mixinName);
							return;
						}

						mixins.set(mixinName, child);
						knownMixins.add(mixinName);
					});

					for (const child of mixins.values()) {
						if (!options.preserve) child.remove();
					}

					root.walkAtRules(IS_APPLY_REGEX, (atRule) => {
						const mixinName = processableApplyRule(atRule);
						if (!mixinName) {
							return;
						}

						const mixin = mixins.get(mixinName);
						if (!mixin || !mixin.nodes) {
							return;
						}

						mixin.each((mixinNode) => {
							atRule.before(mixinNode.clone());
						});

						if (!options.preserve) atRule.remove();
					});
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
