import type { PluginCreator } from 'postcss';
import { transform } from './transform';
import { parse, parseCustomMedia } from '@csstools/media-query-list-parser';
import { stringify } from '@csstools/css-tokenizer';

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
			'custom-media': (atRule) => {
				if (!(atRule.params.includes('<') || atRule.params.includes('>') || atRule.params.includes('='))) {
					return;
				}

				const customMedia = parseCustomMedia(atRule.params, {
					preserveInvalidMediaQueries: true,
					onParseError: () => {
						throw atRule.error(`Unable to parse media query "${atRule.params}"`);
					},
				});

				if (!customMedia || !customMedia.mediaQueryList) {
					return;
				}

				const original = customMedia.mediaQueryList.map((x) => x.toString()).join(',');
				const transformed = transform(customMedia.mediaQueryList);
				if (original === transformed) {
					return;
				}

				atRule.params = `${stringify(...customMedia.name)} ${transformed}`;
			},
		},
	};
};

creator.postcss = true;

export default creator;
