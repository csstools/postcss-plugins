import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-rewrite-url';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		options: {
			rewriter: (value) => {
				return {
					url: value.url + '#modified',
				};
			},
		},
	},
	'examples/example': {
		message: 'minimal example',
		options: {
			rewriter: (value) => {
				return {
					url: value.url + '#modified',
				};
			},
		},
	},
});
