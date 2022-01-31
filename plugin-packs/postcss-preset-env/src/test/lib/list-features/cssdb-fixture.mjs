export const cssdb = [
	{
		'id': 'any-link-pseudo-class',
		'title': '`:any-link` Hyperlink Pseudo-Class',
		'description': 'A pseudo-class for matching anchor elements independent of whether they have been visited',
		'specification': 'https://www.w3.org/TR/selectors-4/#any-link-pseudo',
		'stage': 2,
		'browser_support': {
			'chrome': '1',
			'and_chr': '18',
			'edge': '79',
			'firefox': '1',
			'and_ff': '4',
			'opera': '15',
			'op_mob': '14',
			'safari': '3',
			'ios_saf': '1',
			'samsung': '1.0',
			'android': '65',
		},
		'docs': {
			'mdn': 'https://developer.mozilla.org/en-US/docs/Web/CSS/:any-link',
		},
		'polyfills': [
			{
				'type': 'PostCSS Plugin',
				'link': 'https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-pseudo-class-any-link',
			},
		],
		'vendors_implementations': 3,
	},
	{
		'id': 'blank-pseudo-class',
		'title': '`:blank` Empty-Value Pseudo-Class',
		'description': 'A pseudo-class for matching form elements when they are empty',
		'specification': 'https://drafts.csswg.org/selectors-4/#blank',
		'stage': 1,
		'browser_support': {},
		'docs': {
			'mdn': 'https://developer.mozilla.org/en-US/docs/Web/CSS/:blank',
		},
		'polyfills': [
			{
				'type': 'JavaScript Library',
				'link': 'https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo',
			},
			{
				'type': 'PostCSS Plugin',
				'link': 'https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo',
			},
		],
		'vendors_implementations': 0,
	},
];
