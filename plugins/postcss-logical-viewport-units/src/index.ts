import type { PluginCreator } from 'postcss';
import { transform } from './transform';

/** postcss-logical-viewport-units plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Control how logical viewport units are replaced. default: "horizontal" */
	writingMode: 'horizontal' | 'vertical',
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			writingMode: 'horizontal',
			preserve: true,
		},
		// Provided options
		opts,
	);

	if (options.writingMode !== 'vertical') {
		options.writingMode = 'horizontal';
	}

	const replacements: { vi: 'vw' | 'vh', vb: 'vw' | 'vh' } = options.writingMode === 'horizontal' ? {
		vi: 'vw',
		vb: 'vh',
	} : {
		vi: 'vh',
		vb: 'vw',
	};

	return {
		postcssPlugin: 'postcss-logical-viewport-units',
		Declaration(decl) {
			const modifiedValue = transform(decl.value, replacements);
			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({
				value: modifiedValue,
			});

			if (options.preserve) {
				return;
			}

			decl.remove();
		},
	};
};

creator.postcss = true;

export default creator;
