import type { PluginCreator } from 'postcss';
import valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './get-custom-properties-from-root';
import { isBlockIgnored } from './is-ignored';
import transformProperties from './transform-properties';

export interface PluginOptions {
	/** Determines whether properties using custom properties should be preserved in their original form. */
	preserve?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

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

			return {
				Once: (root) => {
					customProperties = getCustomPropertiesFromRoot(root);
				},
				Declaration: (decl) => {
					let localCustomProperties = customProperties;
					if (preserve && decl.parent) {
						let didCopy = false;

						decl.parent.each((siblingDecl) => {
							if (decl === siblingDecl) {
								return;
							}

							if (siblingDecl.type !== 'decl') {
								return;
							}

							if (!siblingDecl.variable || isBlockIgnored(siblingDecl)) {
								return;
							}

							if (!didCopy) {
								localCustomProperties = new Map(customProperties);
								didCopy = true;
							}

							if (siblingDecl.value.toLowerCase().trim() === 'initial') {
								localCustomProperties.delete(siblingDecl.prop);
								return;
							}

							localCustomProperties.set(siblingDecl.prop, valuesParser(siblingDecl.value));
						});
					}

					transformProperties(decl, localCustomProperties, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
