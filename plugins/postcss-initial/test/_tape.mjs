import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-initial';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'all-initial-default': {
		message: 'all default',
	},
	'combined:preserve-false': {
		message: 'combined',
		options: {
			preserve: false,
		},
	},
	'combined': {
		message: 'combined',
	},
	'multivalue': {
		message: 'multi value',
	},
	'negative': {
		message: 'negative',
	},
	'no-duplication': {
		message: 'no duplication',
	},
	'simple:preserve-false': {
		message: 'simple',
		options: {
			preserve: false,
		},
	},
	'simple': {
		message: 'simple',
	},
	'unknown': {
		message: 'unknown',
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
});
