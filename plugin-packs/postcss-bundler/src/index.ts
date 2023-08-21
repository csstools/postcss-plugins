import type { PluginCreator } from 'postcss';
import postcssImport from './postcss-import/index';
import postcssRebaseURL from '@csstools/postcss-rebase-url';

/** postcss-bundler plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-bundler',
		plugins: [
			postcssImport(),
			postcssRebaseURL(),
		],
	};
};

creator.postcss = true;

export default creator;
