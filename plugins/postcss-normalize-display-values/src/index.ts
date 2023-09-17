import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import mappings from './mappings';

function transform(value: string) {
	const { nodes } = valueParser(value);

	if (nodes.length === 1) {
		return value;
	}

	const values = nodes
		.filter((node) => node.type === 'word') // only display values
		.map((node) => node.value.toLowerCase()); // to lower case

	if (values.length <= 1) {
		return value;
	}

	const match = mappings.get(values.join(','));

	if (!match) {
		return value;
	}

	return match;
}

const IS_DISPLAY = /^display$/i;

/** postcss-normalize-display-values plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts?.preserve) : true;

	return {
		postcssPlugin: 'postcss-normalize-display-values',
		prepare() {
			const cache = new Map();
			return {
				Declaration(decl) {
					if (!IS_DISPLAY.test(decl.prop)) {
						return;
					}

					const value = decl.value;
					if (!value) {
						return;
					}

					if (cache.has(value)) {
						if (decl.value !== cache.get(value)) {
							decl.cloneBefore({ value: cache.get(value) });

							if (!preserve) {
								decl.remove();
							}
						}

						return;
					}

					const result = transform(value);
					cache.set(value, result);

					if (decl.value === result) {
						return;
					}

					decl.cloneBefore({ value: result });

					if (!preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

