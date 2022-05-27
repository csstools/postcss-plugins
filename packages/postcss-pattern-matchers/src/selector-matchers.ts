export const selectorMatchers = [
	{
		'feature': 'has',
		'supports': 'selector(:has(f))',
		'sniff': ':has(',
		'matchers': [
			{
				'type': 'function',
				'value': 'selector',
				'nodes': [
					{
						'type': 'div',
						'value': ':',
					},
					{
						'type': 'function',
						'value': 'has',
						'nodes': [
							{
								'type': 'word',
								'isVariadic': true,
								'isVariable': true,
							},
						],
					},
				],
			},
		],
	},
];