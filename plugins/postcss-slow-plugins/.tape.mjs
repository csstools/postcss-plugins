import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-slow-plugins';
import postcssPresetEnv from 'postcss-preset-env';

await postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		plugins: [
			plugin({ ignore: ['postcss-oklab-function', 'autoprefixer'] }),
			postcssPresetEnv({ stage: 0, browsers: 'Chrome 90' }),
		],
	},
});
