import { hasSupportsAtRuleAncestor } from '@csstools/utilities';
import type { Declaration, PluginCreator } from 'postcss';

/** postcss-font-width-property plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const IS_FONT_WIDTH_REGEX = /^font-width$/i;
const HAS_FONT_WIDTH_REGEX = /\bfont-width\b/i;
const IS_FONT_STRETCH_REGEX = /^font-stretch$/i;

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
		postcssPlugin: 'postcss-font-width-property',
		Declaration(decl): void {
			if (!IS_FONT_WIDTH_REGEX.test(decl.prop)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, HAS_FONT_WIDTH_REGEX)) {
				return;
			}

			// Insert the new value before the current value.
			decl.cloneBefore({
				prop: 'font-stretch',
			});

			// If the current value is preserved we are done and return here.
			if (options.preserve) {
				return;
			}

			// If the current value is not preserved we remove it.
			decl.remove();
		},
	};
};

function hasFallback(node: Declaration): boolean {
	const parent = node.parent;
	if (!parent) {
		return false;
	}

	for (const sibling of parent.nodes) {
		if (sibling === node) {
			continue;
		}

		if (sibling.type === 'decl' && IS_FONT_STRETCH_REGEX.test(sibling.prop)) {
			return true;
		}
	}

	return false;
}

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
