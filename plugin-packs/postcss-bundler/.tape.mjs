import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-bundler';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'leading-slash': {
		message: "does not infer a root to resolve leading slash imports",
		exception: /Failed to find \'\/imports\/basic.css\'/,
	},
	'examples/example': {
		message: 'minimal example',
	},
});
