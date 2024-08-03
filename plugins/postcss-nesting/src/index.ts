import type { PluginCreator } from 'postcss';
import type { pluginOptions as pluginOptions2021 } from './editions/2021';
import type { pluginOptions as pluginOptions2024_02 } from './editions/2024-02';
import plugin2021 from './editions/2021';
import plugin2024_02 from './editions/2024-02';

export type { pluginOptions as pluginOptions2021 } from './editions/2021';
export type { pluginOptions as pluginOptions2024_02 } from './editions/2024-02';


/** postcss-nesting plugin options */
export type pluginOptions = {
	/** The implementation edition for CSS Nesting, default to '2024-02' */
	edition?: '2021' | '2024-02',
} & pluginOptions2021 & pluginOptions2024_02;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			edition: '2024-02',
		},
		// Provided options
		opts,
	);

	switch (options.edition) {
		case '2021':
			return plugin2021(opts);
		case '2024-02':
			return plugin2024_02(opts);
		default:
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Invalid edition: ${options.edition}`);
	}
};

creator.postcss = true;

export default creator;
