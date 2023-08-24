import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-minify';

await postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	bootstrap: {
		message: "minifies bootstrap",
	},
	'preset-env-basic': {
		message: "minifies the basic preset-env test",
	},
	'examples/example': {
		message: 'minimal example',
	},
});
