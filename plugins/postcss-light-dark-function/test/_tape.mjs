import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-light-dark-function';
import postcssNesting from 'postcss-nesting';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports basic usage',
		options: {
			preserve: false,
		},
	},
	'both-in-root': {
		message: 'limited bloat in :root when combined with nesting',
		plugins: [
			plugin(),
			postcssNesting(),
		],
	},
	'cascade-layers-a': {
		message: 'supports cascade layers',
	},
	'cascade-layers-b': {
		message: 'supports cascade layers',
	},
	'cascade-layers-c': {
		message: 'supports cascade layers',
	},
	'cascade-layers-d': {
		message: 'supports cascade layers',
	},
	'color-scheme-normal': {
		message: 'support color-scheme normal',
	},
	'common-patterns-1': {
		message: 'support common patterns',
	},
	ignore: {
		message: 'ignores values with fallbacks or guard by @supports',
	},
	variables: {
		message: 'supports css variables',
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
	'examples/root': {
		message: ':root example',
	},
	'examples/element': {
		message: 'element example',
	},
});
