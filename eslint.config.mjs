import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'**/dist/*',
			'sites/**',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked.map((config) => {
		return {
			...config,
			files: [
				'**/*.ts',
				'**/*.cts',
				'**/*.mts',
			],
		};
	}),
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: 2022,
			sourceType: 'module',
		},

		rules: {
			quotes: ['error', 'single'],
			'comma-dangle': ['error', 'always-multiline'],
			semi: ['error', 'always'],
			curly: 'error',
			'brace-style': 'error',

			indent: ['error', 'tab', {
				SwitchCase: 1,
			}],

			radix: 'error',
			'space-in-parens': ['error', 'never'],
		},
	},
	{
		files: [
			'**/*.js',
			'**/*.cjs',
			'**/*.mjs',
		],
		ignores: [
			'**/src/browser.js',
			'**/src/browser-global.js',
		],
	},
	{
		files: [
			'**/src/browser.js',
			'**/src/browser-global.js',
		],
		languageOptions: {
			globals: {
				...globals.browser,
			},
			ecmaVersion: 2022,
			sourceType: 'module',
		},
	},
	{
		files: [
			'**/*.ts',
			'**/*.cts',
			'**/*.mts',
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': 'error',

			'@typescript-eslint/array-type': ['error', {
				default: 'generic',
			}],

			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-base-to-string': 'off',
		},
	},
];
