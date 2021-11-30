const valueParser = require('postcss-value-parser');

// whether the value has a lab() or lch() matcher
const gradientRegExp = /(repeating-)?(conic|linear|radial)-gradient\([\W\w]*\)/i;
const gradientPartsRegExp = /^(repeating-)?(conic|linear|radial)-gradient$/i;

const isPunctuationCommaNode = node => node.type === 'div' && node.value === ',';

function insertBefore(nodes, node, ...values) {
	const index = nodes.findIndex(n => n === node);
	nodes.splice.apply(nodes, [index - 1, 0].concat(
		Array.prototype.slice.call(...values, 0)),
	);
}

function isNumericNode(node) {
	let result = false;

	try {
		result = valueParser.unit(node?.value) !== false;
	} catch (e) {
		// Error silently
	}

	return result;
}

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
				valueAST = valueParser(decl.value);
			} catch (error) {
				decl.warn(
					result,
					`Failed to parse value '${decl.value}' as a CSS gradient. Leaving the original value intact.`,
				);
			}

			if (typeof valueAST === 'undefined') {
				// Bail if there's an error
				return;
			}

			valueAST.walk(func => {
				if (func.type !== 'function' || !gradientPartsRegExp.test(func.value)) {
					return;
				}

				const nodes = func.nodes;

				nodes.slice(0).forEach((node, index, nodes) => {
					const oneValueBack = Object(nodes[index - 2]); // Skip one for space
					const twoValuesBack = Object(nodes[index - 4]);
					const nextNode = Object(nodes[index + 2]);
					const isDoublePositionLength = twoValuesBack.type && isNumericNode(oneValueBack) && isNumericNode(node);

					// if the argument concludes a double-position gradient
					if (isDoublePositionLength) {
						// insert the fallback colors
						const color = { type: twoValuesBack.type, value: twoValuesBack.value };
						const comma = {
							type: 'div',
							value: ',',
							before: isPunctuationCommaNode(nextNode) ? nextNode.before : '',
							after: isPunctuationCommaNode(nextNode) ? '' : ' ',
						};

						insertBefore(func.nodes, node, [comma, color]);
					}
				});

				return false;
			});

			const modifiedValue = valueAST.toString();

			if (modifiedValue !== decl.value) {
				if (preserve) decl.cloneBefore({ value: modifiedValue });
				else decl.value = modifiedValue;
			}
		},
	};
};

module.exports.postcss = true;
