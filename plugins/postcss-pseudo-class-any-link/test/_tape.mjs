import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-pseudo-class-any-link';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false,
		},
	},
	'basic:sub-features-area-href': {
		message: 'supports { subFeatures: { areaHrefNeedsFixing: true } } usage',
		options: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
		},
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true,
				subFeatures: {
					areaHrefNeedsFixing: true,
				},
			}),
		],
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false,
		},
	},
	'generated-selector-cases:sub-features-area-href': {
		message: 'correctly handles generated cases with areaHrefNeedsFixing: true',
		warnings: 1,
		options: {
			preserve: false,
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
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
	'examples/example:area-false': {
		message: 'minimal example',
		options: {
			subFeatures: {
				areaHrefNeedsFixing: true,
			},
		},
	},
});
