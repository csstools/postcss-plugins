import postcss from 'postcss';
import getReplacedValue from './lib/get-replaced-value';
import getSupportedValue from './lib/get-supported-value';
import setSupportedValue from './lib/set-supported-value';

export default postcss.plugin('postcss-env-fn', opts => root => {
	const variables = Object(Object(opts).variables);

	root.walk(node => {
		const supportedValue = getSupportedValue(node);

		if (supportedValue) {
			const replacedValue = getReplacedValue(supportedValue, variables);

			if (replacedValue !== supportedValue) {
				setSupportedValue(node, replacedValue);
			}
		}
	});
});
