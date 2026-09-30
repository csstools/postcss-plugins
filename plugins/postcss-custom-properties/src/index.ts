import type { Node, Plugin, PluginCreator } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import getCustomPropertiesFromSiblings from './get-custom-properties-from-siblings';
import { HAS_VAR_FUNCTION_REGEX } from './is-var-function';
import { hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { transformProperties } from './transform-properties';
import { MAX_TRANSFORMED_NODES } from './transform-value-ast';
import type { TransformValueASTBudget } from './transform-value-ast';

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

			// Share a single expansion budget across all declarations in this
			// document so that a value that resolves to a large subtree can not be
			// inlined once per declaration.
			let expansionBudget: TransformValueASTBudget = { remaining: MAX_TRANSFORMED_NODES };

			return {
				postcssPlugin: 'postcss-custom-properties',
				Once(root): void {
					expansionBudget = { remaining: MAX_TRANSFORMED_NODES };
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

					transformProperties(decl, customProperties, { preserve: preserve, budget: expansionBudget });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
