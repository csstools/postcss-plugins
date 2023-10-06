import type { PluginCreator } from 'postcss';
import { parseStyles } from './lib/parse-styles';
import { applyConditions } from './lib/apply-conditions';
import { applyStyles } from './lib/apply-styles';

/** postcss-bundler plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-bundler',
		async Once(styles, { result, atRule, postcss }) {
			const bundle = await parseStyles(
				result,
				styles,
				null,
				[],
				[],
				postcss,
			);

			applyConditions(bundle, atRule);
			applyStyles(bundle, styles);
		},
	};
};

creator.postcss = true;

export default creator;
