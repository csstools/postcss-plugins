import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-is-pseudo-class';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve': {
		message: "supports basic usage with { preserve: true }",
		options: {
			preserve: true
		}
	},
	'basic:does-not-exist': {
		message: "supports basic usage with { specificityMatchingName: 'something-random' }",
		options: {
			specificityMatchingName: 'something-random'
		}
	},
	'basic:oncomplex:warning': {
		message: "supports basic usage with { onComplexSelector: 'warning' }",
		warnings: 10,
		options: {
			onComplexSelector: 'warning'
		}
	},
	'browser': {
		message: "prepare CSS for chrome test",
		options: {
			preserve: false
		}
	},
	'complex': {
		message: "supports complex selectors",
		options: {
			preserve: false
		}
	},
	'generated-selector-class-function-cases': {
		message: "supports generated selector class function cases",
		warnings: 11,
		options: {
			preserve: true
		}
	},
	example: {
		message: "minimal example",
	},
	'pseudo-element-warning': {
		message: "warns when pseudo elements are found",
		warnings: 4,
	},
});
