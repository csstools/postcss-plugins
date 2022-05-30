import type { PluginCreator } from 'postcss';
import { supportConditionsFromValue, declarationIsGuardedByAtSupports } from '@csstools/postcss-pattern-matchers';

const creator: PluginCreator<null> = () => {
	return {
		postcssPlugin: 'postcss-progressive-custom-properties',
		RuleExit: (rule, { postcss }) => {
			const atSupportsRules = [];
			const variableNames = new Set<string>();

			rule.each((decl) => {
				if (decl.type !== 'decl') {
					return;
				}

				if (!decl.variable) {
					return;
				}

				if (decl.value.trim() === 'initial') {
					// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
					return;
				}

				if (decl.value.trim() === '') { // empty string value
					// https://www.w3.org/TR/css-variables-1/#guaranteed-invalid
					return;
				}

				// The first encountered property is the fallback for the oldest targets.
				if (!variableNames.has(decl.prop.toString())) {
					variableNames.add(decl.prop.toString());
					return;
				}

				const supportConditions = supportConditionsFromValue(decl.value);
				if (!supportConditions.length) {
					return;
				}

				if (declarationIsGuardedByAtSupports(decl, supportConditions)) {
					return;
				}

				// Any subsequent properties are progressive enhancements.
				const atSupports = postcss.atRule({
					name: 'supports',
					params: supportConditions.join(' and '),
					source: rule.source,
					raws: {
						before: '\n\n',
						after: '\n',
					},
				});

				const parentClone = rule.clone();
				parentClone.removeAll();

				parentClone.raws.before = '\n';

				parentClone.append(decl.clone());
				decl.remove();

				atSupports.append(parentClone);
				atSupportsRules.push(atSupports);
			});

			if (atSupportsRules.length === 0) {
				return;
			}

			// rule.after reverses the at rule order.
			// reversing the call order gives in the correct order overall.
			atSupportsRules.reverse().forEach((atSupports) => {
				rule.after(atSupports);
			});
		},
	};
};

creator.postcss = true;

export default creator;
