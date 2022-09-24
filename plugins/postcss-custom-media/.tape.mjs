import postcssTape from '../../packages/postcss-tape/dist/index.cjs';
import plugin from 'postcss-custom-media';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
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
	'complex': {
		message: 'supports complex usage'
	},
	'cyclic': {
		message: 'handles cyclic references'
	},
	'override': {
		message: 'handles reference overrides'
	},
	'modifiers': {
		message: 'supports media query modifiers'
	},
	'list': {
		message: 'supports media query lists'
	}
});
