import getCustomProperties from './lib/get-custom-properties';
import importCustomPropertiesFromSources from './lib/import-from';
import parser from 'postcss-values-parser';
import postcss from 'postcss';
import transformAST from './lib/transform';

export default postcss.plugin('postcss-color-mod-function', opts => {
	// how unresolved functions and arguments should be handled (default: "throw")
	const unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();

	// how transformed colors will be produced in CSS
	const stringifierOpt = Object(opts).stringifier || (color => color.toLegacy());

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	//  whether var() within color-mod() should use Custom Properties or var() fallback
	const transformVarsOpt = 'transformVars' in Object(opts) ? opts.transformVars : true;

	// promise any custom selectors are imported
	const customPropertiesPromise = importCustomPropertiesFromSources(importFrom);

	return async (root, result) => {
		const customProperties = Object.assign(
			await customPropertiesPromise,
			getCustomProperties(root, { preserve: true })
		);

		root.walkDecls(decl => {
			const originalValue = decl.value;

			if (colorModFunctionMatch.test(originalValue)) {
				const ast = parser(originalValue, { loose: true }).parse();

				transformAST(ast, {
					unresolved: unresolvedOpt,
					stringifier: stringifierOpt,
					transformVars: transformVarsOpt,
					decl,
					result,
					customProperties
				});

				const modifiedValue = ast.toString();

				if (originalValue !== modifiedValue) {
					decl.value = modifiedValue;
				}
			}
		});
	};
});

const colorModFunctionMatch = /(^|[^\w-])color-mod\(/i;
