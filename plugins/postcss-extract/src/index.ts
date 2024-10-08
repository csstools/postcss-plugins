import type { Plugin, PluginCreator } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { extract } from './select-nodes';

export type pluginOptions = {
	/** Mapping of queries */
	queries: Record<string, string>,
	/** Extract after transforms are likely to be done, or before it */
	extractLate: boolean,
	/** Callback for results */
	results: (results: Record<string, Array<Record<string, unknown>>>) => void,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object(opts) as pluginOptions;

	const parsedQueries: Map<string, selectorParser.Root> = new Map();
	Object.keys(options.queries ?? {}).forEach((query) => {
		parsedQueries.set(query, selectorParser().astSync(options.queries[query]));
	});

	if (!options.results) {
		options.results = (results): void => {
			// eslint-disable-next-line no-console
			console.log(results);
		};
	}

	return {
		postcssPlugin: 'postcss-extract',
		prepare(): Plugin {
			if (options.extractLate) {
				return {
					postcssPlugin: 'postcss-extract',
					OnceExit(root): void {
						options.results(extract(root, parsedQueries));
					},
				};
			} else {
				return {
					postcssPlugin: 'postcss-extract',
					Once(root): void {
						options.results(extract(root, parsedQueries));
					},
				};
			}
		},
	};
};

creator.postcss = true;

export default creator;

