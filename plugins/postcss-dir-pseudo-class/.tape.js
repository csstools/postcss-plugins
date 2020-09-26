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
};
