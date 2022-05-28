export const selectorMatchers = [
	{
		'feature': 'has',
		'supports': 'selector(:has(f))',
		'sniff': ':has(',
		'matchers': [
			{
				'type': 'selector',
				'value': '',
				'nodes': [
					{
						'type': 'pseudo',
						'value': ':has($$)',
						'nodes': [
							{
								'type': 'selector',
								'value': '',
								'nodes': [
									{
										'type': 'tag',
										'value': '$$',
										'isVariable': true,
										'isVariadic': true,
									},
								],
							},
						],
					},
				],
			},
			{
				'type': 'function',
				'value': 'selector',
				'nodes': [
					{
						'type': 'selector',
						'value': '',
						'nodes': [
							{
								'type': 'pseudo',
								'value': ':has($$)',
								'nodes': [
									{
										'type': 'selector',
										'value': '',
										'nodes': [
											{
												'type': 'tag',
												'value': '$$',
												'isVariable': true,
												'isVariadic': true,
											},
										],
									},
								],
							},
						],
					},
					{
						'type': 'selector',
						'value': '',
						'nodes': [
							{
								'type': 'pseudo',
								'value': ' :is(foo)',
								'nodes': [
									{
										'type': 'selector',
										'value': '',
										'nodes': [
											{
												'type': 'tag',
												'value': 'foo',
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
];