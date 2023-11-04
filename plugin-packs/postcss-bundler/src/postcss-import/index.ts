import type { PluginCreator } from 'postcss';
import { parseStyles } from './lib/parse-styles';
import { applyConditions } from './lib/apply-conditions';
import { applyStyles } from './lib/apply-styles';
import { postProcess } from './lib/post-process';

const creator: PluginCreator<never> = () => {
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

			postProcess(bundle, atRule);

			applyConditions(bundle, atRule);
			applyStyles(bundle, styles);
		},
	};
};

creator.postcss = true;

export default creator;
