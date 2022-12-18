import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-logical';

postcssTape(plugin)({
	margins: {
		message: 'supports logical "margin" properties'
	}
});
