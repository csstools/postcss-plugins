import type { AtRule, Plugin, PluginCreator } from 'postcss';
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
		prepare(): Plugin {
			const expander = new MixinExpander();

			return {
				postcssPlugin: 'mixins',
				Once(root): void {
					const rootAtRules: Array<AtRule> = [];
					root.each((child) => {
						if (child.type === 'atrule') {
							rootAtRules.push(child);
						}
					});

					expander.registerMixins(rootAtRules);

					if (!options.preserve) {
						for (const mixin of expander.registeredMixins()) {
							mixin.atRule.remove();
						}
					}

					expander.expandAll(root, options.preserve === true);
					expander.finish();
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
