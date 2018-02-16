// tooling
import parser from 'postcss-values-parser';
import postcss from 'postcss';
import transformAST from './lib/transform';

// plugin
export default postcss.plugin('postcss-color-mod-function', opts => {
	const unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
	const stringifierOpt = Object(opts).stringifier || (color => color.toLegacy());
	const transformVarsOpt = 'transformVars' in Object(opts) ? opts.transformVars : true;

	return (root, result) => {
		root.walkDecls(decl => {
			const originalValue = decl.value;

			if (colorModFunctionMatch.test(originalValue)) {
				const ast = parser(originalValue, { loose: true }).parse();

				transformAST(ast, {
					unresolved: unresolvedOpt,
					stringifier: stringifierOpt,
					transformVars: transformVarsOpt,
					decl,
					result
				});

				const modifiedValue = ast.toString();

				if (originalValue !== modifiedValue) {
					decl.value = modifiedValue;
				}
			}
		});
	};
});

const colorModFunctionMatch = /(^|\s)color-mod\(/i;
