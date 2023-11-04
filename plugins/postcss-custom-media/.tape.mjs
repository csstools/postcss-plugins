import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-custom-media';

postcssTape(plugin)({
	'basic-after-v9': {
		message: 'supports basic usage'
	},
	'basic-after-v9:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'basic': {
		message: 'supports basic usage (old)',
		warnings: 1,
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		warnings: 1,
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true
			})
		]
	},
	'cascade-layers': {
		message: 'supports cascade layers',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
	'examples/true': {
		message: 'minimal example with "true"',
	},
	'examples/false': {
		message: 'minimal example with "false"',
	},
	'examples/complex': {
		message: 'minimal example complex queries',
	},
	'nesting': {
		message: 'works when nested'
	},
	'not-processable': {
		message: 'only handles processable @custom-media rules'
	},
	'parser-checks': {
		message: 'supports more obscure CSS'
	},
	'eof-1': {
		message: 'handles EOF correctly (1)',
		warnings: 1,
	},
	'eof-2': {
		message: 'handles EOF correctly (2)',
		warnings: 1,
	},
	'eof-3': {
		message: 'handles EOF correctly (3)',
		warnings: 1,
	},
	'eof-4': {
		message: 'handles EOF correctly (4)',
		warnings: 1,
	},
	'complex': {
		message: 'supports complex usage'
	},
	'cyclic': {
		message: 'handles cyclic references',
		warnings: 3,
	},
	'override': {
		message: 'handles reference overrides'
	},
	'modifiers': {
		message: 'supports media query modifiers'
	},
	'list': {
		message: 'supports media query lists'
	},
	'true-false': {
		message: 'supports true|false keywords'
	},
	'comma-1': {
		message: 'can correctly split media query lists'
	},
	'comma-2': {
		message: 'can correctly split media query lists'
	},
	'and': {
		message: 'supports media queries with "and"'
	},
	'not': {
		message: 'supports media queries with "not"'
	},
	'or': {
		message: 'supports media queries with "or"'
	}
});
