const { parse } = require('postcss-values-parser');
const processImageSet = require('./lib/process-image-set');

const imageSetValueMatchRegExp = /(^|[^\w-])(-webkit-)?image-set\(/i;
const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i;

/**
 * @param {{preserve?: boolean, oninvalid?: string}} opts
 * @returns {import('postcss').Plugin}
 */
module.exports = function creator(opts) {
	// prepare options
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;
	const oninvalid = 'oninvalid' in Object(opts) ? opts.oninvalid : 'ignore';

	return {
		postcssPlugin: 'postcss-image-set-function',
		Once(root, helpers) {
			// for every declaration
			root.walkDecls(decl => {
				const {value} = decl;

				// if a declaration likely uses an image-set() function
				if (imageSetValueMatchRegExp.test(value)) {
					let valueAST

					try {
						valueAST = parse(value, { ignoreUnknownWords: true })
					} catch (error) {
						decl.warn(
							helpers.result,
							`Failed to parse value '${value}' as an image-set function. Leaving the original value intact.`
						)
					}

					if (typeof valueAST === 'undefined') {
						return
					}

					// process every image-set() function
					valueAST.walkFuncs(node => {
						if (imageSetFunctionMatchRegExp.test(node.name)) {
							processImageSet(node.nodes, decl, {
								decl,
								oninvalid,
								preserve,
								result: helpers.result,
							});
						}
					});
				}
			});
		},
	};
};

module.exports.postcss = true;
