import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-font-weights';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:prefix': {
		message: 'supports { prefix: \'x\' }',
		options: {
			prefix: 'x',
		},
	},
	'custom': {
		message: 'supports custom usage',
		options: {
			weights: {
				'custom-weight-1': 300,
				'custom-weight-2': 500,
			},
		},
	},
	'prefix': {
		message: 'prefixed props without prefix config are ignored',
	},
	'prefix:prefix': {
		message: 'supports { prefix: \'x\' }',
		options: {
			prefix: 'x',
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
});
