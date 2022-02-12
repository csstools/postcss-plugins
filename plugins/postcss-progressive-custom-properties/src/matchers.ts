export const matchers = [
	{
		'supports': 'color(display-p3 0 0 0)',
		'property': 'color',
		'sniff': 'color',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'srgb',
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'srgb',
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'display-p3',
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'display-p3',
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'color(xyz 0 0 0)',
		'property': 'color',
		'sniff': 'color',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'hsl(0, 0%, 0%)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			{
				'type': 'function',
				'value': 'hsl',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'hsl(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsl',
		'matchers': [
			{
				'type': 'function',
				'value': 'hsl',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'hsl',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'hsla(0 0% 0% / 0)',
		'property': 'color',
		'sniff': 'hsla',
		'matchers': [
			{
				'type': 'function',
				'value': 'hsla',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'hwb(0 0% 0%)',
		'property': 'color',
		'sniff': 'hwb',
		'matchers': [
			{
				'type': 'function',
				'value': 'hwb',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'hwb',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'lab(0% 0 0)',
		'property': 'color',
		'sniff': 'lab',
		'matchers': [
			{
				'type': 'function',
				'value': 'lab',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'lab',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'lch(0% 0 0)',
		'property': 'color',
		'sniff': 'lch',
		'matchers': [
			{
				'type': 'function',
				'value': 'lch',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'lch',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'oklab(0% 0 0)',
		'property': 'color',
		'sniff': 'oklab',
		'matchers': [
			{
				'type': 'function',
				'value': 'oklab',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'oklab',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'oklch(0% 0 0)',
		'property': 'color',
		'sniff': 'oklch',
		'matchers': [
			{
				'type': 'function',
				'value': 'oklch',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'oklch',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'rgb(0, 0, 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			{
				'type': 'function',
				'value': 'rgb',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': ',',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'rgb(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgb',
		'matchers': [
			{
				'type': 'function',
				'value': 'rgb',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'rgb',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
	{
		'supports': 'rgba(0 0 0 / 0)',
		'property': 'color',
		'sniff': 'rgba',
		'matchers': [
			{
				'type': 'function',
				'value': 'rgba',
				'nodes': [
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
						'value': ' ',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'div',
						'value': '/',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
		],
	},
];