import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-custom-shorthands-experimental';

postcssTape(plugin)({
	'0001/basic': {
		message: "supports basic usage",
		options: {
			experimentalVersion: 1
		}
	},
	'0001/basic:vscode-custom-data': {
		message: "supports basic usage",
		options: {
			experimentalVersion: 1,
			generateVSCodeCustomDataInDirectory: './test/0001'
		}
	},
	'0001/atrule-name': {
		message: "supports a custom at rule name",
		options: {
			atRuleName: 'property',
			experimentalVersion: 1,
		}
	},
	'0002/basic': {
		message: "supports basic usage",
		options: {
			experimentalVersion: 2
		}
	},
	'0002/basic:vscode-custom-data': {
		message: "supports basic usage",
		options: {
			experimentalVersion: 2,
			generateVSCodeCustomDataInDirectory: './test/0002'
		}
	},
	'0002/atrule-name': {
		message: "supports a custom at rule name",
		options: {
			atRuleName: 'property',
			experimentalVersion: 2,
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example-0001': {
		message: 'minimal example',
		options: {
			experimentalVersion: 1
		}
	},
});
