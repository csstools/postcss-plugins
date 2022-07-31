import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-design-tokens';
import postcssImport from 'postcss-import';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		plugins: [
			postcssImport(),
			plugin()
		]
	},
	'basic:rootFontSize-20': {
		message: "supports basic usage with { unitsAndValues { rootFontSize: 20 } }",
		plugins: [
			postcssImport(),
			plugin({
				unitsAndValues: {
					rootFontSize: 20
				}
			})
		]
	},
	'basic:rootFontSize-NaN': {
		message: "supports basic usage with { unitsAndValues { rootFontSize: NaN } }",
		plugins: [
			postcssImport(),
			plugin({
				unitsAndValues: {
					rootFontSize: NaN
				}
			})
		]
	},
	'basic:rootFontSize-invalid': {
		message: "supports basic usage with { unitsAndValues { rootFontSize: invalid } }",
		plugins: [
			postcssImport(),
			plugin({
				unitsAndValues: {
					rootFontSize: 'invalid'
				}
			})
		]
	},
	'errors': {
		message: "handles issues correctly",
		options: {},
		warnings: 4
	},
	'is': {
		message: "supports basic usage with { is ['dark', 'tablet', 'branded-green'] }",
		options: {
			is: ['dark', 'tablet', 'branded-green']
		}
	},
	'value-parsing-a': {
		message: "supports value parsing (A)",
	},
	'value-parsing-b': {
		message: "supports value parsing (B)",
	},
	'value-parsing-c': {
		message: "supports value parsing (C)",
		warnings: 2
	},
	'value-parsing-d': {
		message: "supports value parsing (D)",
		warnings: 2
	},
	'value-parsing-e': {
		message: "supports value parsing (E)",
		warnings: 2
	},
	'value-parsing-f': {
		message: "supports value parsing (F)",
	},
	'value-parsing-g': {
		message: "supports value parsing (G)",
		warnings: 2
	},
	'examples/example': {
		message: 'minimal example',
		options: {},
	},
	'examples/example-conditional': {
		message: 'minimal example with conditional imports : default',
		options: {},
	},
	'examples/example-conditional:dark': {
		message: 'minimal example with conditional imports : dark',
		options: {
			is: ['dark']
		},
	},
	'examples/example:rootFontSize-20': {
		message: "minimal example with { unitsAndValues { rootFontSize: 20 } }",
		options: {
			unitsAndValues: {
				rootFontSize: 20
			}
		}
	},
	'examples/example-custom-value-function-name': {
		message: 'minimal example with { valueFunctionName: "token" }',
		options: {
			valueFunctionName: 'token'
		}
	},
	'examples/example-custom-import-at-rule-name': {
		message: 'minimal example with { importAtRuleName: "tokens" }',
		options: {
			importAtRuleName: 'tokens'
		}
	},
});
