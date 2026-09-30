import type { Declaration, PluginCreator } from 'postcss';

/** postcss-fit-tolerance-property plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const IS_FIT_TOLERANCE_REGEX = /^fit-tolerance$/i;
const IS_FLOW_TOLERANCE_REGEX = /^flow-tolerance$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-fit-tolerance-property',
		Declaration(decl): void {
			if (!IS_FIT_TOLERANCE_REGEX.test(decl.prop)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			// TODO: check for fallback

			// Insert the new value before the current value.
			decl.cloneBefore({
				prop: 'flow-tolerance',
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

		if (sibling.type === 'decl' && IS_FLOW_TOLERANCE_REGEX.test(sibling.prop)) {
			return true;
		}
	}

	return false;
}

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
