import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-bundler';

const testCases = {
	basic: {
		message: "supports basic usage",
	},
	'leading-slash': {
		message: "does not infer a root to resolve leading slash imports",
		exception: /Failed to find \'\/imports\/basic.css\'/,
	},
	'does-not-exist': {
		message: "throws on files that don't exist",
		exception: /Failed to find 'imports\/does-not-exist.css'/,
	},
	'examples/example': {
		message: 'minimal example',
	},
}

postcssTape(plugin)(testCases);
