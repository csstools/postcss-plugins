module.exports = {
	basic: {
		message: "supports basic usage",
	},
	"basic:dir": {
		message: 'supports { dir: "ltr" } usage',
		source: "basic.css",
		options: {
			dir: "ltr",
		},
	},
	"basic:preserve": {
		message: "supports { preserve: true } usage",
		source: "basic.css",
		options: {
			preserve: true,
		},
	},
	"basic:shadow": {
		message: "support { shadow: true } usage",
		source: "basic.css",
		options: {
			shadow: true
		},
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 2,
		options: {
			preserve: false
		}
	},
};
