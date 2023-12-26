import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-slow-plugins';

const variableSpeedCreator = (delay) => {
	return {
		postcssPlugin: `postcss-${delay}ms`,
		Once: async () => {
			await new Promise((resolve) => setTimeout(resolve, delay));
		},
	};
};

variableSpeedCreator.postcss = true;

await postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		plugins: [
			plugin({ ignore: ['postcss-30ms'] }),
			variableSpeedCreator(10),
			variableSpeedCreator(20),
			variableSpeedCreator(30),
			variableSpeedCreator(40),
		],
	},
});
