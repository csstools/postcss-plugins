import type { PluginCreator } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { extract } from './select-nodes';

type pluginOptions = {
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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		parsedQueries.set(query, selectorParser().astSync(options.queries[query]));
	});

	if (!options.results) {
		options.results = (results) => {
			console.log(results);
		};
	}

	return {
		postcssPlugin: 'postcss-extract',
		prepare: () => {
			if (opts.extractLate) {
				return {
					OnceExit: (root) => {
						options.results(extract(root, parsedQueries));
					},
				};
			} else {
				return {
					Once: (root) => {
						options.results(extract(root, parsedQueries));
					},
				};
			}
		},
	};
};

creator.postcss = true;

export default creator;

