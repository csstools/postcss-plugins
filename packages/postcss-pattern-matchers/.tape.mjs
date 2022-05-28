import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import { selectorIsGuardedByAtSupports } from '@csstools/postcss-pattern-matchers';

const creator = () => {
	return {
		postcssPlugin: 'postcss-test-plugin',
		Rule(rule, { Comment }) {
			if (selectorIsGuardedByAtSupports(rule)) {
				rule.before(
					new Comment({ text: 'is guarded by at supports', source: rule.source })
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
