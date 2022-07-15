import type { PluginCreator } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import transformProperties from './transform-properties';

export interface PluginOptions {
	/** Determines whether properties using custom properties should be preserved in their original form. */
	preserve?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-custom-properties',
		prepare: () => {
			let customProperties: Map<string, valuesParser.ParsedValue> = new Map();

			return {
				Once: (root) => {
					customProperties = getCustomPropertiesFromRoot(root);
				},
				Declaration: (decl) => {
					transformProperties(decl, customProperties, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
