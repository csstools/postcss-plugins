import type { PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { hasFallback } from './has-fallback-decl';

/** postcss-color-rebeccapurple plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const HAS_REBECCAPURPLE = /rebeccapurple/i;
const IS_REBECCAPURPLE = /^rebeccapurple$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-color-rebeccapurple',
		Declaration(decl) {
			if (!HAS_REBECCAPURPLE.test(decl.value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			const valueAST = valuesParser(decl.value);
			valueAST.walk(node => {
				if (node.type === 'word' && IS_REBECCAPURPLE.test(node.value)) {
					node.value = '#639';
				}
			});

			const modifiedValue = String(valueAST);
			if (modifiedValue === decl.value) {
				return;
			}

			// Insert the new value before the current value.
			decl.cloneBefore({
				value: modifiedValue,
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

creator.postcss = true;

export default creator;

