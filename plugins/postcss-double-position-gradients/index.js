const {parse} = require("postcss-values-parser");
const Punctuation = require("postcss-values-parser/lib/nodes/Punctuation");

// whether the value has a lab() or lch() matcher
const gradientRegExp = /(repeating-)?(conic|linear|radial)-gradient\([\W\w]*\)/i;
const gradientPartsRegExp = /^(repeating-)?(conic|linear|radial)-gradient$/i;

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
module.exports = function creator(opts) {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-double-position-gradients',
		Declaration(decl) {
			if (!gradientRegExp.test(decl.value)) {
				return;
			}

			const valueAST = parse(decl.value, { ignoreUnknownWords: true });

			valueAST.walkFuncs((func) => {
				if (!gradientPartsRegExp.test(func.name)) {
					return;
				}

				func.walkNumerics((node, index) => {
					/** @type {import('postcss-values-parser').ChildNode} */
					const node1back = Object(func.nodes[index - 1]);
					/** @type {import('postcss-values-parser').ChildNode} */
					const node2back = Object(func.nodes[index - 2]);
					/** @type {import('postcss-values-parser').ChildNode} */
					const node1next = Object(func.nodes[index + 1]);

					// if the argument concludes a double-position gradient
					if (node2back.type && node1back.type === 'numeric') {
						// insert the fallback colors
						const color = node2back.clone();
						const comma = new Punctuation({
							value: ',',
							raws: node1next.type === 'punctuation' && node1next.value === ','
								? Object.assign({}, node1next.clone().raws)
								: { before: '', after: '' }
						});

						func.insertBefore(node, [comma, color]);
					}
				})
			})

			const modifiedValue = String(valueAST);

			if (modifiedValue !== decl.value) {
				if (preserve) decl.cloneBefore({ value: modifiedValue });
				else decl.value = modifiedValue;
			}
		}
	}
}

module.exports.postcss = true;
