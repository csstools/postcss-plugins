import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-dir-pseudo-class';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		warnings: 2,
	},
	"basic:dir": {
		message: 'supports { dir: "ltr" } usage',
		source: "basic.css",
		warnings: 2,
		options: {
			dir: "ltr",
		},
	},
	"basic:preserve": {
		message: "supports { preserve: true } usage",
		source: "basic.css",
		warnings: 2,
		options: {
			preserve: true,
		},
	},
	"basic:shadow": {
		message: "support { shadow: true } usage",
		source: "basic.css",
		warnings: 2,
		options: {
			shadow: true
		},
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 38,
		options: {
			preserve: false
		}
	},
});
