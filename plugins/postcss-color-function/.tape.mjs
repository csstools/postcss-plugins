import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-color-function';
import lab from 'postcss-lab-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		warnings: 6,
		options: {
			preserve: true
		}
	},
	'lab-function-interop': {
		message: 'supports usage along side postcss-lab-function',
		plugins: [
			plugin({ preserve: true }),
			lab({ preserve: true, subFeatures: { displayP3: true } }),
		]
	},
	'lab-function-interop:preserve:false': {
		message: 'supports usage along side postcss-lab-function with { preserve: false }',
		plugins: [
			plugin({ preserve: false}),
			lab({ preserve: false, subFeatures: { displayP3: true } }),
		]
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-true': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'variables:preserve-true:progressive-false': {
		message: 'supports variables with { preserve: true, enableProgressiveCustomProperties: false } usage',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
	'examples/example:preserve-true:progressive-false': {
		message: 'minimal example',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		}
	}
});
