import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-initial';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'all-initial-default': {
		message: "all default",
	},
	'all-initial-inherited': {
		message: "all inherited"
	},
	'combined-replace': {
		message: "combined",
		options: {
			preserve: false,
		}
	},
	'combined': {
		message: "combined"
	},
	'multivalue-replace': {
		message: "multi value",
		options: {
			preserve: false,
		}
	},
	'negative': {
		message: "negative"
	},
	'no-duplication': {
		message: "no duplication"
	},
	'simple-replace': {
		message: "simple",
		options: {
			preserve: false,
		}
	},
	'simple': {
		message: "simple"
	},
	'unknown': {
		message: "unknown"
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
});
