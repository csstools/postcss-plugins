import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-media-minmax';

postcssTape(plugin)({
	'aspect-ratio': {
		message: 'aspect-ratio feature',
	},
	'calc': {
		message: 'use calc() in range notation',
	},
	'color-index': {
		message: 'color-index feature',
	},
	'color': {
		message: 'color feature',
	},
	'comments': {
		message: 'use comments in range notation',
	},
	'complex': {
		message: 'complex examples',
	},
	'custom-media': {
		message: '@custom-media',
	},
	'device-aspect-ratio': {
		message: 'device-aspect-ratio feature',
	},
	'device-width-height': {
		message: 'device-width-height feature',
	},
	'env': {
		message: 'handling of `env()` function values',
	},
	'line-break': {
		message: 'line breaks in range notation',
	},
	'min-max': {
		message: 'various combinations of operators and orders of values and names',
	},
	'monochrome': {
		message: 'monochrome feature',
	},
	'more-units': {
		message: 'various units in values',
	},
	'operators': {
		message: 'various combinations of operators and orders of values and names',
	},
	'other-name': {
		message: 'various examples',
	},
	'resolution': {
		message: 'resolution feature',
	},
	'shorthands': {
		message: 'various examples',
	},
	'unknown-feature': {
		message: 'unknown feature',
	},
	'width-height': {
		message: 'width/height feature',
	},
	'examples/example': {
		message: 'minimal example',
	},
});
