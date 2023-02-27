import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		plugins: [
			plugin({
				files: [
					'./test/fixtures/fixture.css',
				]
			}),
			postcssCustomMedia(),
		],
	},
});
