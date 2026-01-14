import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	{
		ignores: [
			'**/dist/*',
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
		ignores: [
			'sites/postcss-preset-env/src/static/js/**/*.js',
		],

		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: 2025,
			sourceType: 'module',
		},

		rules: {
			'no-console': ['error'],
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

			'no-duplicate-imports': 'error',
		},
	},
	{
		files: [
			'**/src/browser.js',
			'**/src/browser-global.js',
			'sites/postcss-preset-env/src/**/*.js',
		],

		languageOptions: {
			globals: {
				...globals.browser,
			},
			ecmaVersion: 2025,
			sourceType: 'module',
		},

		rules: {
			'no-console': ['error'],
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
			'no-console': ['error'],
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': 'error',

			'@typescript-eslint/array-type': ['error', {
				default: 'generic',
			}],

			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
];
