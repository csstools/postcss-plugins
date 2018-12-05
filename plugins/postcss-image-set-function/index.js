import postcss from 'postcss';
import valueParser from 'postcss-values-parser';
import processImageSet from './lib/process-image-set';

const imageSetValueMatchRegExp = /(^|[^\w-])(-webkit-)?image-set\(/i
const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i

export default postcss.plugin('postcss-image-set-function', opts => {
	// prepare options
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;
	const oninvalid = 'oninvalid' in Object(opts) ? opts.oninvalid : 'ignore';

	return (root, result) => {
		// for every declaration
		root.walkDecls(decl => {
			const { value } = decl;

			// if a declaration likely uses an image-set() function
			if (imageSetValueMatchRegExp.test(value)) {
				const valueAST = valueParser(value).parse();

				// process every image-set() function
				valueAST.walkType('func', node => {
					if (imageSetFunctionMatchRegExp.test(node.value)) {
						processImageSet(
							node.nodes.slice(1, -1),
							decl,
							{ decl, oninvalid, preserve, result }
						);
					}
				})
			}
		})
	}
});
