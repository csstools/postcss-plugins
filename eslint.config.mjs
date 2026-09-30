import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

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

		plugins: {
			'@stylistic': stylistic,
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

			'eqeqeq': 'error',
			'no-useless-return': 'error',
			'@stylistic/semi': ['error', 'always'],
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

		plugins: {
			'@stylistic': stylistic,
		},

		rules: {
			'no-console': ['error'],
			'no-unused-vars': ['error', { 'caughtErrorsIgnorePattern': '_' }],
			'no-constant-condition': 'off',
			'eqeqeq': 'error',
			'no-useless-return': 'error',
			'@stylistic/semi': ['error', 'always'],
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

		plugins: {
			'@stylistic': stylistic,
		},

		rules: {
			'no-console': ['error'],
			'no-shadow': 'off',
			'eqeqeq': 'error',
			'no-useless-return': 'error',
			'@stylistic/semi': ['error', 'always'],
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
