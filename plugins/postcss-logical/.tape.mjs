import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-logical';

postcssTape(plugin)({
	'border': {
		message: 'supports logical "border" property values'
	},
	'border:ltr': {
		message: 'supports logical "border" property values with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'border:preserve': {
		message: 'supports logical "border" property values with { preserve: true }',
		options: {
			preserve: true
		}
	},
	'clear': {
		message: 'supports logical "clear" property values'
	},
	'clear:ltr': {
		message: 'supports logical "clear" property values with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'float': {
		message: 'supports logical "float" property values'
	},
	'float:ltr': {
		message: 'supports logical "float" property values with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'inset': {
		message: 'supports logical "inset" properties'
	},
	'inset:ltr': {
		message: 'supports logical "inset" properties with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'margin': {
		message: 'supports logical "margin" properties'
	},
	'margin:ltr': {
		message: 'supports logical "margin" properties with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'padding': {
		message: 'supports logical "padding" properties'
	},
	'padding:ltr': {
		message: 'supports logical "padding" properties with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'resize': {
		message: 'supports logical "resize" properties'
	},
	'size': {
		message: 'supports logical "size" properties'
	},
	'size:preserve': {
		message: 'supports logical "size" properties with { preserve: true }',
		options: {
			preserve: true
		}
	},
	'text-align': {
		message: 'supports logical "text-align" properties'
	},
	'text-align:ltr': {
		message: 'supports logical "text-align" properties with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'transition': {
		message: 'supports logical "transition" properties'
	},
	'transition:ltr': {
		message: 'supports logical "transition" properties with { dir: "ltr" }',
		options: {
			dir: 'ltr'
		}
	},
	'transition:preserve:ltr': {
		message: 'supports logical "transition" properties with { dir: "ltr", preserve: true }',
		options: {
			dir: 'ltr',
			preserve: true
		}
	},
	'generated-declaration-cases': {
		message: 'correctly handles generated cases',
		options: {
			preserve: false
		}
	},
	'generated-declaration-cases:preserve': {
		message: 'correctly handles generated cases',
		options: {
			preserve: true
		}
	},
});
