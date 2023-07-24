import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';

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
	'open-props': {
		message: "supports open-props usage",
		plugins: [
			plugin({
				files: [
					'node_modules://open-props/media.min.css',
					'node_modules://open-props/open-props.min.css',
				]
			}),
			postcssCustomProperties({ preserve: false }),
			postcssCustomMedia({ preserve: false }),
		],
	},
});
