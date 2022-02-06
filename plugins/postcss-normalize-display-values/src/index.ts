import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import mappings from './mappings';

function transform(value) {
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

const creator: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-normalize-display-values',
		prepare() {
			const cache = new Map();
			return {
				Declaration: {
					display(decl) {
						const value = decl.value;

						if (!value) {
							return;
						}

						if (cache.has(value)) {
							if (decl.value !== cache.get(value)) {
								if (preserve) {
									decl.cloneBefore({ value: cache.get(value) });
								} else {
									decl.value = cache.get(value);
								}
							}

							return;
						}

						const result = transform(value);

						if (decl.value !== result) {
							if (preserve) {
								decl.cloneBefore( { value: result } );
							} else {
								decl.value = result;
							}
						}

						cache.set(value, result);
					},
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

