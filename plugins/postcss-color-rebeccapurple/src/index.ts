import type { PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';

type pluginOptions = { preserve?: boolean };

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
			if (!decl.value.toLowerCase().includes('rebeccapurple')) {
				return;
			}

			const valueAST = valuesParser(decl.value);
			valueAST.walk(node => {
				if (node.type === 'word' && node.value.toLowerCase() === 'rebeccapurple') {
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

