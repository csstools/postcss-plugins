import { type AtRule, type PluginCreator, type Rule } from 'postcss';
import { conditionsFromValue } from './conditions-from-values';

const hasVariableFunction = /var\(/i;

const creator: PluginCreator<null> = () => {
	return {
		postcssPlugin: 'postcss-progressive-custom-properties',
		OnceExit: (root, { postcss }) => {
			root.walkRules((rule) => {
				const atSupportsRules: Array<AtRule> = [];
				const propNames = new Set<string>();

				const lastConditionParams: {
					support: string | undefined,
					media: string | undefined,
				} = {
					support: undefined,
					media: undefined,
				};
				let lastConditionalRule: Rule | undefined = undefined;

				rule.each((decl) => {
					if (decl.type !== 'decl') {
						return;
					}

					// The first encountered property is the fallback for the oldest targets.
					if (decl.variable) {
						// custom properties are case-sensitive
						if (!propNames.has(decl.prop.toString())) {
							propNames.add(decl.prop.toString());
							return;
						}
					} else {
						// regular properties are case-insensitive
						if (!propNames.has(decl.prop.toString().toLowerCase())) {
							propNames.add(decl.prop.toString().toLowerCase());
							return;
						}
					}

					if (!(decl.variable || hasVariableFunction.test(decl.value))) {
						return;
					}

					if (decl.value.trim().toLowerCase() === 'initial') {
						// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
						return;
					}

					if (decl.value.trim() === '') { // empty string value
						// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
						return;
					}

					// if the property itself isn't a custom property, the value must contain a var() function
					const mustContainVar = !decl.variable;

					const conditions = conditionsFromValue(decl.value, mustContainVar);

					let supportParams: string | undefined = undefined;
					let mediaParams: string | undefined = undefined;

					if (conditions.support.length) {
						supportParams = conditions.support.join(' and ');
					}

					if (conditions.media.length) {
						mediaParams = conditions.media.join(' and ');
					}

					if (!mediaParams && !supportParams) {
						return;
					}

					if (
						(lastConditionParams.support !== supportParams) ||
						(lastConditionParams.media !== mediaParams)
					) {
						lastConditionalRule = undefined;
					}

					if (lastConditionalRule) {
						lastConditionalRule.append(decl.clone());
						decl.remove();
						return;
					}

					const atRules = [];

					if (supportParams) {
						atRules.push(postcss.atRule({
							name: 'supports',
							params: supportParams,
							source: rule.source,
							raws: {
								before: '\n\n',
								after: '\n',
							},
						}));
					}

					if (mediaParams) {
						atRules.push(postcss.atRule({
							name: 'media',
							params: mediaParams,
							source: rule.source,
							raws: {
								before: '\n\n',
								after: '\n',
							},
						}));
					}

					if (!atRules.length) {
						return;
					}

					for (let i = 0; i < (atRules.length - 1); i++) {
						const x = atRules[i];
						const y = atRules[i + 1];

						x.append(y);
					}

					const outerAtRule = atRules[0];
					const innerAtRule = atRules[atRules.length - 1];

					const parentClone = rule.clone();
					parentClone.removeAll();

					parentClone.raws.before = '\n';

					parentClone.append(decl.clone());
					decl.remove();

					lastConditionParams.support = supportParams;
					lastConditionParams.media = mediaParams;
					lastConditionalRule = parentClone;

					innerAtRule.append(parentClone);
					atSupportsRules.push(outerAtRule);
				});

				if (atSupportsRules.length === 0) {
					return;
				}

				// rule.after reverses the at rule order.
				// reversing the call order gives in the correct order overall.
				atSupportsRules.reverse().forEach((atSupports) => {
					rule.after(atSupports);
				});
			});
		},
	};
};

creator.postcss = true;

export default creator;
