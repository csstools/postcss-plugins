import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-rgba-css-variables';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:replace-required': {
		message: '使用到的 variables 会替换成rgb',
		options: {
			mode: 'replace-required'
		}
	},
	'basic:replace-all': {
		message: '全部的 variables 会被替换成rgb',
		options: {
			mode: 'replace-all'
		}
	}
	// 'basic:color': {
	// 	message: "supports { color: '<a color>' }",
	// 	options: {
	// 		color: 'purple'
	// 	}
	// },
	// 'examples/example': {
	// 	message: 'minimal example',
	// },
	// 'examples/example:preserve-true': {
	// 	message: 'minimal example',
	// 	options: {
	// 		preserve: true
	// 	}
	// },
});
