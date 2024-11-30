import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-rewrite-url';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		options: {
			rewriter: (value, context) => {
				if (context.property === 'background-image') {
					return false;
				}

				if (value.urlModifiers.includes('--url-modifier-a')) {
					return {
						url: value.url + '#modified-a',
					};
				}

				if (value.urlModifiers.includes('--url-modifier-b')) {
					return {
						url: value.url + '#modified-b',
						urlModifiers: [],
					};
				}

				if (value.urlModifiers.includes('--url-modifier-c')) {
					return {
						url: value.url + '#modified-c',
						urlModifiers: ['crossorigin(anonymous)'],
					};
				}

				if (value.urlModifiers.includes('--url-modifier-d')) {
					return {
						url: value.url + '#modified-d',
						urlModifiers: value.urlModifiers.filter((x) => x !== '--url-modifier-d'),
					};
				}

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
