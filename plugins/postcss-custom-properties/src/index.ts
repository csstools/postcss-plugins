import type { PluginCreator } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import transformProperties from './lib/transform-properties';

export interface PluginOptions {
	/** Determines whether Custom Properties and properties using custom properties should be preserved in their original form. */
	preserve?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	// whether to preserve custom selectors and rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;
	let customProperties : Map<string, valuesParser.ParsedValue> = new Map();

	return {
		postcssPlugin: 'postcss-custom-properties',
		Once: (root) => {
			customProperties = getCustomPropertiesFromRoot(root);
		},
		Declaration: (decl) => {
			transformProperties(decl, customProperties, { preserve: preserve });
		},
		OnceExit: () => {
			customProperties.clear();
		},
	};
};

creator.postcss = true;

export default creator;
