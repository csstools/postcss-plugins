'use strict';
import { parse } from '../../dist/index.mjs';
import { assertNodeIsEqual } from '../assert.mjs';

const testCases = [
	{
		message: 'rgb',
		src: 'rgb(255,255,255)',
		expected: {
			type: 'root',
			nodes: [
				{
					name: 'rgb',
					type: 'func',
					isColor: true,
					isVar: false,
					nodes: [
						{
							value: '255',
							type: 'numeric',
							unit: '',
						},
						{
							value: ',',
							type: 'punctuation',
						},
						{
							value: '255',
							type: 'numeric',
							unit: '',
						},
						{
							value: ',',
							type: 'punctuation',
						},
						{
							value: '255',
							type: 'numeric',
							unit: '',
						},
					],
					params: '(255,255,255)',
				},
			],
		},
	},
];

testCases.forEach((testCase) => {
	const result = parse(testCase.src);
	assertNodeIsEqual(result, testCase.expected);
});
