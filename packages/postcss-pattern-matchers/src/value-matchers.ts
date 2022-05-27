export const valueMatchers = [
	{
		'feature': 'color',
		'supports': '(color: color(srgb 0 0 0))',
		'sniff': 'color(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(srgb-linear 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'srgb-linear',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'srgb-linear',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(a98-rgb 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'a98-rgb',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'a98-rgb',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(prophoto-rgb 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'prophoto-rgb',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'prophoto-rgb',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(display-p3 0 0 0))',
		'sniff': 'color(',
		'matchers': [
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(rec2020 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'rec2020',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'rec2020',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(xyz-d50 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'xyz-d50',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'xyz-d50',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(xyz-d65 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'xyz-d65',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'xyz-d65',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color',
		'supports': '(color: color(xyz 0 0 0))',
		'sniff': 'color(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color',
				'nodes': [
					{
						'type': 'word',
						'value': 'xyz',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'value': 'xyz',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'hsl',
		'supports': '(color: hsl(0, 0%, 0%))',
		'sniff': 'hsl(',
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
		'feature': 'hsl',
		'supports': '(color: hsl(0 0% 0% / 0))',
		'sniff': 'hsl(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'hsla',
		'supports': '(color: hsla(0 0% 0% / 0))',
		'sniff': 'hsla(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'hwb',
		'supports': '(color: hwb(0 0% 0%))',
		'sniff': 'hwb(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'lab',
		'supports': '(color: lab(0% 0 0))',
		'sniff': 'lab(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'lch',
		'supports': '(color: lch(0% 0 0))',
		'sniff': 'lch(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'oklab',
		'supports': '(color: oklab(0% 0 0))',
		'sniff': 'oklab(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'oklch',
		'supports': '(color: oklch(0% 0 0))',
		'sniff': 'oklch(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'rgb',
		'supports': '(color: rgb(0, 0, 0, 0))',
		'sniff': 'rgb(',
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
		'feature': 'rgb',
		'supports': '(color: rgb(0 0 0 / 0))',
		'sniff': 'rgb(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'rgba',
		'supports': '(color: rgba(0 0 0 / 0))',
		'sniff': 'rgba(',
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
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
		'feature': 'color-mix',
		'supports': '(color: color-mix(in oklch, #000, #fff))',
		'sniff': 'color-mix(',
		'matchers': [
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
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
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
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
						'type': 'space',
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
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
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
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
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
						'type': 'space',
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
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'type': 'space',
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
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
				],
			},
			{
				'type': 'function',
				'value': 'color-mix',
				'nodes': [
					{
						'type': 'word',
						'value': 'in',
					},
					{
						'type': 'space',
					},
					{
						'type': 'word',
						'isVariable': true,
					},
					{
						'type': 'space',
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
						'type': 'space',
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
						'type': 'space',
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
		'feature': 'ic',
		'supports': '(font-size: 1ic)',
		'sniff': 'ic',
		'matchers': [
			{
				'type': 'word',
				'value': '1ic',
				'dimension': {
					'unit': 'ic',
				},
			},
		],
	},
];