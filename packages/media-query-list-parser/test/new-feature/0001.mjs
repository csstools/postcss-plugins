import assert from 'node:assert';
import { newMediaFeaturePlain } from '@csstools/media-query-list-parser';
import { TokenType } from '@csstools/css-tokenizer';

{
	const feature = newMediaFeaturePlain(
		'min-width',
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.Dimension, '300px', -1, -1, { value: 300, unit: 'px' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
	);

	assert.deepStrictEqual(
		feature.toJSON(),
		{
			'type': 'media-feature',
			'feature': {
				'type': 'mf-plain',
				'name': {
					'type': 'mf-name',
					'name': 'min-width',
					'tokens': [
						[
							'ident-token',
							'min-width',
							-1,
							-1,
							{
								'value': 'min-width',
							},
						],
					],
				},
				'value': {
					'type': 'mf-value',
					'value': {
						'type': 'function',
						'name': 'calc',
						'tokens': [
							[
								'function-token',
								'calc(',
								-1,
								-1,
								{
									'value': 'calc',
								},
							],
							[
								'dimension-token',
								'300px',
								-1,
								-1,
								{
									'value': 300,
									'unit': 'px',
								},
							],
							[
								')-token',
								')',
								-1,
								-1,
								undefined,
							],
						],
						'value': [
							{
								'type': 'token',
								'tokens': [
									[
										'dimension-token',
										'300px',
										-1,
										-1,
										{
											'value': 300,
											'unit': 'px',
										},
									],
								],
							},
						],
					},
					'tokens': [
						[
							'function-token',
							'calc(',
							-1,
							-1,
							{
								'value': 'calc',
							},
						],
						[
							'dimension-token',
							'300px',
							-1,
							-1,
							{
								'value': 300,
								'unit': 'px',
							},
						],
						[
							')-token',
							')',
							-1,
							-1,
							undefined,
						],
					],
				},
				'tokens': [
					[
						'ident-token',
						'min-width',
						-1,
						-1,
						{
							'value': 'min-width',
						},
					],
					[
						'colon-token',
						':',
						-1,
						-1,
						undefined,
					],
					[
						'function-token',
						'calc(',
						-1,
						-1,
						{
							'value': 'calc',
						},
					],
					[
						'dimension-token',
						'300px',
						-1,
						-1,
						{
							'value': 300,
							'unit': 'px',
						},
					],
					[
						')-token',
						')',
						-1,
						-1,
						undefined,
					],
				],
			},
			'before': [
				[
					'(-token',
					'(',
					-1,
					-1,
					undefined,
				],
			],
			'after': [
				[
					')-token',
					')',
					-1,
					-1,
					undefined,
				],
			],
		},
	);
}
