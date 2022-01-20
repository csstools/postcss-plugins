module.exports = {
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
};
