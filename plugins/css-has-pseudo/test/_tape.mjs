import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'css-has-pseudo';
import postcssLogical from 'postcss-logical';
import postcssNesting from 'postcss-nesting';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';

postcssTape(plugin, { skipPackageNameCheck: true })({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false,
		},
	},
	'basic:specificity-matching-name': {
		message: 'supports { specificityMatchingName: "other-thing-that-does-not-exist" } usage',
		options: {
			specificityMatchingName: 'other-thing-that-does-not-exist',
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false,
		},
	},
	'browser': {
		message: 'prepare CSS for chrome test',
	},
	'plugin-order-logical:before': {
		message: 'works with other plugins that modify selectors',
		plugins: [postcssLogical({ preserve: false }), postcssDirPseudoClass({ preserve: false }), plugin({ preserve: false })],
	},
	'plugin-order-logical:after': {
		message: 'works with other plugins that modify selectors',
		plugins: [plugin({ preserve: false }), postcssLogical({ preserve: false }), postcssDirPseudoClass({ preserve: false })],
	},
	'plugin-order-logical:before:preserve': {
		message: 'works with other plugins that modify selectors',
		plugins: [postcssLogical({ preserve: true }), postcssDirPseudoClass({ preserve: true }), plugin({ preserve: true })],
	},
	'plugin-order-logical:after:preserve': {
		message: 'works with other plugins that modify selectors',
		plugins: [plugin({ preserve: true }), postcssLogical({ preserve: true }), postcssDirPseudoClass({ preserve: true })],
	},
	'plugin-order-nesting:before': {
		message: 'works with other plugins that modify selectors',
		plugins: [postcssNesting({ preserve: false }), plugin({ preserve: false })],
	},
	'plugin-order-nesting:after': {
		message: 'works with other plugins that modify selectors',
		plugins: [postcssNesting({ preserve: false }), plugin({ preserve: false })],
	},
	'plugin-order-nesting:before:preserve': {
		message: 'works with other plugins that modify selectors',
		plugins: [plugin({ preserve: true }), postcssNesting({ preserve: true })],
	},
	'plugin-order-nesting:after:preserve': {
		message: 'works with other plugins that modify selectors',
		plugins: [plugin({ preserve: true }), postcssNesting({ preserve: true })],
	},
});
