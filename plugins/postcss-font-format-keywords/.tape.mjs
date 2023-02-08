import { atRuleClonerPlugin, postcssTape } from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-font-format-keywords';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'basic:with-cloned-rules': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			atRuleClonerPlugin,
			plugin({
				preserve: true
			})
		]
	},
});
