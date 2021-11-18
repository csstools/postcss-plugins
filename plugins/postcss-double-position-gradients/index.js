const { parse } = require('postcss-values-parser');
const Punctuation = require('postcss-values-parser/lib/nodes/Punctuation');

// whether the value has a lab() or lch() matcher
const gradientRegExp = /(repeating-)?(conic|linear|radial)-gradient\([\W\w]*\)/i;
const gradientPartsRegExp = /^(repeating-)?(conic|linear|radial)-gradient$/i;

const isPunctuationCommaNode = node => node.type === 'punctuation' && node.value === ','

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
module.exports = function creator(opts) {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	return {
		postcssPlugin: 'postcss-double-position-gradients',
		Declaration(decl, { result }) {
			if (!gradientRegExp.test(decl.value)) {
				return;
			}

			let valueAST;

			try {
				valueAST = parse(decl.value, { ignoreUnknownWords: true });
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${decl.value}' as a CSS gradient. Leaving the original value intact.`
				);
			}

			if (typeof valueAST === 'undefined') {
				// Bail if there's an error
				return;
			}

			valueAST.walkFuncs((func) => {
				if (!gradientPartsRegExp.test(func.name)) {
					return;
				}

				const nodes = func.nodes;

				nodes.slice(0).forEach((node, index, nodes) => {
					const node1back = Object(nodes[index - 1]);
					const node2back = Object(nodes[index - 2]);
					const node1next = Object(nodes[index + 1]);

					const isDoublePositionLength = node2back.type && node1back.type === 'numeric' && node.type === 'numeric';

					// if the argument concludes a double-position gradient
					if (isDoublePositionLength) {
						// insert the fallback colors
						const color = node2back.clone();
						const comma = new Punctuation({
							value: ',',
							raws: isPunctuationCommaNode(node1next)
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
