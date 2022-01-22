import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-pseudo-class-any-link';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:sub-features-area-href': {
		message: 'supports { subFeatures: { areaHrefNeedsFixing: true } } usage',
		options: {
			subFeatures: {
				areaHrefNeedsFixing: true
			}
		}
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false
		}
	},
	'generated-selector-cases:sub-features-area-href': {
		message: 'correctly handles generated cases with areaHrefNeedsFixing: true',
		warnings: 1,
		options: {
			preserve: false,
			subFeatures: {
				areaHrefNeedsFixing: true
			}
		}
	},
});
