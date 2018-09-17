import { importCustomPropertiesFromSources, importCustomPropertiesFromCSSAST } from './lib/import';
import parser from 'postcss-values-parser';
import postcss from 'postcss';
import transformAST from './lib/transform';

export default postcss.plugin('postcss-color-mod-function', opts => {
	const unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
	const stringifierOpt = Object(opts).stringifier || (color => color.toLegacy());
	const importFrom = [].concat(Object(opts).importFrom || []);
	const transformVarsOpt = 'transformVars' in Object(opts) ? opts.transformVars : true;

	const customPropertiesPromise = importCustomPropertiesFromSources(importFrom);

	return async (root, result) => {
		const customProperties = Object.assign(await customPropertiesPromise, await importCustomPropertiesFromCSSAST(root));

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
