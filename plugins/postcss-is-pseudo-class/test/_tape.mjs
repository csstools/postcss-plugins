import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-is-pseudo-class';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve': {
		message: 'supports basic usage with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'basic:does-not-exist': {
		message: 'supports basic usage with { specificityMatchingName: \'something-random\' }',
		options: {
			specificityMatchingName: 'something-random',
		},
	},
	'basic:oncomplex:warning': {
		message: 'warns on complex selectors',
		warnings: 9,
		options: {
			onComplexSelector: 'warning',
		},
	},
	'basic:oncomplex:no-warning': {
		message: 'can silence warnings on complex selectors',
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'browser': {
		message: 'prepare CSS for chrome test',
		options: {
			preserve: false,
		},
	},
	'compound-after-complex-is': {
		message: 'can handle compound selectors after complex selectors in :is()',
		options: {
			preserve: false,
		},
	},
	'complex': {
		message: 'supports complex selectors',
		options: {
			preserve: false,
		},
	},
	'generated-selector-class-function-cases': {
		message: 'supports generated selector class function cases',
		warnings: 1,
		options: {
			preserve: true,
		},
	},
	example: {
		message: 'minimal example',
	},
	'pseudo-element:warning': {
		message: 'warns when pseudo elements are found',
		warnings: 4,
		options: {
			onPseudoElement: 'warning',
		},
	},
	'pseudo-element:no-warning': {
		message: 'can silence warnings when pseudo elements are found',
	},
});
