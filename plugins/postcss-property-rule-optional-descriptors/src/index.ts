import type { PluginCreator } from 'postcss';

/** postcss-property-rule-optional-descriptors plugin options */
export type pluginOptions = never;

const IS_AT_PROPERTY_REGEX = /^property$/i;

const creator: PluginCreator<pluginOptions> = () => {

	return {
		postcssPlugin: 'postcss-property-rule-optional-descriptors',
		AtRule(atRule, { postcss }): void {
			if (!IS_AT_PROPERTY_REGEX.test(atRule.name)) {
				return;
			}

			const descriptors = new Set(atRule.nodes?.filter(x => x.type === 'decl').map(x => x.prop.toLowerCase()));

			if (!descriptors.has('syntax')) {
				atRule.append(postcss.decl({
					prop: 'syntax',
					value: '"*"',
					// @ts-expect-error https://github.com/postcss/postcss/pull/2138
					source: atRule.source
				}));
			}

			if (!descriptors.has('inherits')) {
				atRule.append(postcss.decl({
					prop: 'inherits',
					value: 'true',
					// @ts-expect-error https://github.com/postcss/postcss/pull/2138
					source: atRule.source
				}));
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
