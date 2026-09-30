import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-property-rule-optional-descriptors';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'minimal example',
	},
});
