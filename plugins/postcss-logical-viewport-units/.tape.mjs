import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-logical-viewport-units';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:vertical': {
		message: "supports vertical writing mode",
		options: {
			writingMode: 'vertical',
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:vertical': {
		message: 'minimal example',
		options: {
			writingMode: 'vertical',
		}
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false
		}
	},
});
