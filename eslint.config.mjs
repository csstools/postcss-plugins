import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	{
		ignores: [
			'**/dist/*',
			'sites/**',
			'e2e/**',
		],
	},
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
		files: [
			'**/*.js',
			'**/*.cjs',
			'**/*.mjs',
		],

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

			'no-empty': ['error', {
				'allowEmptyCatch': true,
			}],
		},
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
		rules: {
			'no-unused-vars': ['error', { 'caughtErrorsIgnorePattern': '_' }],
			'no-constant-condition': 'off',
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
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/only-throw-error': 'off', // https://github.com/postcss/postcss/pull/1947
		},
	},
];
