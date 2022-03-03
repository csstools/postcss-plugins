import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { includesGradientsFunction, isGradientsFunctions } from './is-gradient';

const isPunctuationCommaNode = node => node.type === 'div' && node.value === ',';

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
			if (!includesGradientsFunction(decl.value)) {
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
				if (func.type !== 'function' || !isGradientsFunctions(func.value)) {
					return;
				}

				// Discarding comments and spaces
				const nodes = func.nodes.filter((x) => {
					return x.type !== 'comment' && x.type !== 'space';
				});

				nodes.forEach((node, index, currentNodes) => {
					const oneValueBack = Object(currentNodes[index - 1]);
					const twoValuesBack = Object(currentNodes[index - 2]);
					const nextNode = Object(currentNodes[index + 1]);
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

						func.nodes.splice(
							// 1 before the current node
							func.nodes.indexOf(node) - 1,
							// remove none
							0,
							// insert these :
							comma, color,
						);
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

type pluginOptions = {
	preserve?: boolean;
	enableProgressiveCustomProperties?: boolean;
};

// Transform double-position gradients in CSS.
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
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
