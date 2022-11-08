import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-design-tokens';
import postcssImport from 'postcss-import';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		plugins: [
			postcssImport(),
			plugin()
		],
		warnings: 1
	},
	'units': {
		message: "supports units usage",
		plugins: [
			plugin()
		],
		warnings: 2
	},
	'units:rootFontSize-20': {
		message: "supports units usage with { unitsAndValues { rootFontSize: 20 } }",
		plugins: [
			plugin({
				unitsAndValues: {
					rootFontSize: 20
				}
			})
		],
		warnings: 2
	},
	'units:rootFontSize-NaN': {
		message: "supports units usage with { unitsAndValues { rootFontSize: NaN } }",
		plugins: [
			plugin({
				unitsAndValues: {
					rootFontSize: NaN
				}
			})
		],
		warnings: 2
	},
	'units:rootFontSize-invalid': {
		message: "supports units usage with { unitsAndValues { rootFontSize: invalid } }",
		plugins: [
			plugin({
				unitsAndValues: {
					rootFontSize: 'invalid'
				}
			})
		],
		warnings: 2
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
	'examples/example-conditional:brand-2': {
		message: 'minimal example with conditional imports : brand-2',
		options: {
			is: ['brand-2']
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
	'issue-583': {
		message: 'A meaningful error message is given and no stack overflow.',
		warnings: 1
	},
});
