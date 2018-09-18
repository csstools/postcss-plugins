import postcss from 'postcss';
import getReplacedValue from './lib/get-replaced-value';
import getSupportedValue from './lib/get-supported-value';
import setSupportedValue from './lib/set-supported-value';
import importEnvironmentVariablesFromSources from './lib/import-from';

export default postcss.plugin('postcss-env-fn', opts => {
	// sources to import environment variables from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// promise any environment variables are imported
	const environmentVariablesPromise = importEnvironmentVariablesFromSources(importFrom);

	return async root => {
		const environmentVariables = await environmentVariablesPromise;

		root.walk(node => {
			const supportedValue = getSupportedValue(node);

			if (supportedValue) {
				const replacedValue = getReplacedValue(supportedValue, environmentVariables);

				if (replacedValue !== supportedValue) {
					setSupportedValue(node, replacedValue);
				}
			}
		});
	};
});
