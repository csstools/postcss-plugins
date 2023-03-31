import type { PluginCreator } from 'postcss';
import { transform } from './transform';
import { parse } from '@csstools/media-query-list-parser';

/** postcss-media-minmax plugin options */
export type pluginOptions = never;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-media-minmax',
		AtRule: {
			media: (atRule) => {
				if (!(atRule.params.includes('<') || atRule.params.includes('>') || atRule.params.includes('='))) {
					return;
				}

				const mediaQueries = parse(atRule.params, {
					preserveInvalidMediaQueries: true,
					onParseError: () => {
						throw atRule.error(`Unable to parse media query "${atRule.params}"`);
					},
				});

				const transformed = transform(mediaQueries);
				if (atRule.params === transformed) {
					return;
				}

				atRule.params = transformed;
			},
		},
	};
};

creator.postcss = true;

export default creator;
