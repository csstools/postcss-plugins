import type { PluginCreator } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import { isDeclarationIgnored } from './is-ignored';
import { transformProperties } from './transform-properties';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { parseOrCached } from './parse-or-cached';
import { HAS_VAR_FUNCTION } from './is-var-function';

/** postcss-custom-properties plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const IS_INITIAL = /^initial$/i;

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
		prepare: () => {
			let customProperties: Map<string, valuesParser.ParsedValue> = new Map();
			const parsedValuesCache: Map<string, valuesParser.ParsedValue> = new Map();

			return {
				Once: (root) => {
					customProperties = getCustomPropertiesFromRoot(root, parsedValuesCache);
				},
				Declaration: (decl) => {
					if (!HAS_VAR_FUNCTION.test(decl.value)) {
						return;
					}

					if (hasSupportsAtRuleAncestor(decl)) {
						return;
					}

					const localCustomProperties : Map<string, valuesParser.ParsedValue> = new Map();
					if (preserve && decl.parent) {
						decl.parent.each((siblingDecl) => {
							if (siblingDecl.type !== 'decl' || !siblingDecl.variable) {
								return;
							}

							if (decl === siblingDecl) {
								return;
							}

							if (isDeclarationIgnored(siblingDecl)) {
								return;
							}

							if (IS_INITIAL.test(siblingDecl.value)) {
								localCustomProperties.delete(siblingDecl.prop);
								return;
							}

							localCustomProperties.set(siblingDecl.prop, parseOrCached(siblingDecl.value, parsedValuesCache));
						});
					}

					transformProperties(decl, customProperties, localCustomProperties, parsedValuesCache, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
