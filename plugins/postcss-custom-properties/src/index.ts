import type { Node, Plugin, PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import getCustomPropertiesFromSiblings from './get-custom-properties-from-siblings';
import { HAS_VAR_FUNCTION_REGEX } from './is-var-function';
import { hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { transformProperties } from './transform-properties';

/** postcss-custom-properties plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const SUPPORTS_REGEX = /\bvar\(|\(top: var\(--f\)/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts?.preserve) : true;

	if ('importFrom' in Object(opts)) {
		throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');
	}

	if ('exportTo' in Object(opts)) {
		throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');
	}

	return {
		postcssPlugin: 'postcss-custom-properties',
		prepare(): Plugin {
			let rootCustomProperties: Map<string, valuesParser.ParsedValue> = new Map();
			const customPropertiesByParent: WeakMap<Node, Map<string, valuesParser.ParsedValue>> = new WeakMap();
			const parsedValuesCache: Map<string, valuesParser.ParsedValue> = new Map();

			return {
				postcssPlugin: 'postcss-custom-properties',
				Once(root): void {
					rootCustomProperties = getCustomPropertiesFromRoot(root, parsedValuesCache);
				},
				Declaration(decl): void {
					if (!HAS_VAR_FUNCTION_REGEX.test(decl.value)) {
						return;
					}

					if (hasSupportsAtRuleAncestor(decl, SUPPORTS_REGEX)) {
						return;
					}

					let customProperties = rootCustomProperties;

					if (preserve && decl.parent) {
						customProperties = customPropertiesByParent.get(decl.parent) ?? getCustomPropertiesFromSiblings(decl, rootCustomProperties, parsedValuesCache);
						customPropertiesByParent.set(decl.parent, customProperties);
					}

					transformProperties(decl, customProperties, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
