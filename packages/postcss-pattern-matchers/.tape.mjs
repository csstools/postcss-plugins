import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import { selectorIsGuardedByAtSupports, declarationIsGuardedByAtSupports, supportConditionsFromSelector, supportConditionsFromValue } from '@csstools/postcss-pattern-matchers';

const creator = () => {
	return {
		postcssPlugin: 'postcss-test-plugin',
		Rule(rule, { Comment }) {
			if (selectorIsGuardedByAtSupports(rule)) {
				rule.before(
					new Comment({ text: 'is guarded by at supports', source: rule.source })
				);

				return;
			}

			const conditions = supportConditionsFromSelector(rule.selector);
			if (conditions.length) {
				rule.before(
					new Comment({ text: 'matched patterns: ' + JSON.stringify(conditions), source: rule.source })
				);
			}
		},
		Declaration(decl, { Comment }) {
			if (declarationIsGuardedByAtSupports(decl)) {
				decl.before(
					new Comment({ text: 'is guarded by at supports', source: decl.source })
				);

				return;
			}

			const conditions = supportConditionsFromValue(decl.value);
			if (conditions.length) {
				decl.before(
					new Comment({ text: 'matched patterns: ' + JSON.stringify(conditions), source: decl.source })
				);
			}
		}
	};
};

creator.postcss = true;

postcssTape(creator)({
	basic: {
		message: "supports basic usage",
	}
});
