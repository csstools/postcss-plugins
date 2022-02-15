import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import valueParser from 'postcss-value-parser';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';

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
	try {
		return valueParser.unit(node?.value) !== false;
	} catch (e) {
		return false;
	}
}

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
const basePlugin = (opts) => {
	return {
		postcssPlugin: 'postcss-double-position-gradients',
		Declaration(decl, { result }) {
			if (!gradientRegExp.test(decl.value)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
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

				// Discarding comments and spaces
				const nodes = func.nodes.filter((x) => {
					return x.type !== 'comment' && x.type !== 'space';
				});

				nodes.forEach((node, index, nodes) => {
					const oneValueBack = Object(nodes[index - 1]);
					const twoValuesBack = Object(nodes[index - 2]);
					const nextNode = Object(nodes[index + 1]);
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
				if (opts.preserve) {
					decl.cloneBefore({ value: modifiedValue });
					return;
				}

				decl.value = modifiedValue;
			}
		},
	};
};

basePlugin.postcss = true;

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
const postcssPlugin = (opts) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-double-position-gradients',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin(options),
			],
		};
	}

	return basePlugin(options);
};

postcssPlugin.postcss = true;

export default postcssPlugin;
