import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { ColorStop, colorStopList } from './color-stop-list';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { includesGradientsFunction, isGradientsFunctions } from './is-gradient';

const interpolationMethods = [
	'shorter',
	'longer',
	'increasing',
	'decreasing',
	'specified',
];

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
const basePlugin = (opts) => {
	return {
		postcssPlugin: 'postcss-gradients-interpolation-method',
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

			let hasUnparseableGradients = false;

			valueAST.walk(func => {
				if (func.type !== 'function' || !isGradientsFunctions(func.value)) {
					return;
				}

				// Discarding comments and spaces
				const nodes = func.nodes.filter((x) => {
					return x.type !== 'comment' && x.type !== 'space';
				});

				// Build gradient data model.
				const gradient: {
					interpolationArguments: Array<Node>,
					colorStops: Array<ColorStop>,
					argumentsRemainder: Array<Node>,
				} = {
					interpolationArguments: [],
					argumentsRemainder: [],
					colorStops: [],
				};

				for (let i = 0; i < nodes.length; i++) {
					const node = nodes[i];
					if (node.type === 'div' && node.value === ',') {
						const interpolationArguments = gradient.interpolationArguments.map((x) => {
							return valueParser.stringify(x);
						}).join(' ');

						const colorStops = colorStopList(nodes.slice(i), interpolationArguments);
						if (colorStops) {
							gradient.colorStops = colorStops;
							break;
						}

						if (interpolationArguments) {
							// If there are no interpolation arguments we do not emit warnings.
							hasUnparseableGradients = true;
						}
						break;
					}

					if (node.type === 'word' && node.value === 'in' && nodes[i + 1]) {
						gradient.interpolationArguments.push(nodes[i + 1]);
						i++;

						if (nodes[i + 1] && nodes[i + 1].type === 'word' && interpolationMethods.includes(nodes[i + 1].value)) {
							gradient.interpolationArguments.push(nodes[i + 1]);
							i++;
							continue;
						}

						continue;
					}

					gradient.argumentsRemainder.push(node);
				}

				// No color stops or interpolation arguments found.
				if (!gradient.interpolationArguments.length || !gradient.colorStops.length) {
					return;
				}

				// Rebuild the entire function.
				func.nodes = [];

				if (gradient.argumentsRemainder.length) {
					func.nodes.push(
						...gradient.argumentsRemainder.flatMap((x) => {
							return [x, { type: 'space', value: ' ' }];
						}),
					);

					func.nodes.push({
						type: 'div',
						value: ',',
					});
				}

				const interpolationArguments = gradient.interpolationArguments.map((x) => {
					return valueParser.stringify(x);
				}).join(' ');

				for (let i = 0; i < (gradient.colorStops.length); i++) {
					const start = gradient.colorStops[i];
					const end = gradient.colorStops[i + 1];

					// Last color stop.
					if (!end) {
						func.nodes.push(
							valueParser(`${start.color} ${start.colorStopLength}`),
						);

						continue;
					}

					// Two equal colors.
					if (start.color === end.color) {
						func.nodes.push(
							valueParser(`${start.color} ${start.colorStopLength}`),
							{ type: 'div', value: ',' },
						);

						continue;
					}

					// Interpolate between colors.
					for (let j = 0; j < 10; j++) {
						if (j === 0) {
							func.nodes.push(
								valueParser(`${start.color} ${start.colorStopLength}`),
								{ type: 'div', value: ',' },
							);

							continue;
						}

						const color = `color-mix(in ${interpolationArguments}, ${start.color} ${100 - (j * 10)}%, ${end.color} ${(j * 10)}%)`;
						const position = `calc(${start.colorStopLength} + ((${end.colorStopLength} - ${start.colorStopLength}) * ${j / 10}))`;

						func.nodes.push(
							valueParser(`${color} ${position}`),
							{ type: 'div', value: ',' },
						);
					}
				}
			});

			if (hasUnparseableGradients) {
				decl.warn(
					result,
					`Failed to parse value '${decl.value}' as a CSS gradient with interpolation. Leaving the original value intact.`,
				);

				return;
			}

			const modifiedValue = valueParser.stringify(valueAST);
			if (modifiedValue === decl.value) {
				return;
			}

			if (opts.preserve) {
				decl.cloneBefore({
					prop: decl.prop,
					value: modifiedValue,
				});
			} else {
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

// Transform gradient interpolation methods.
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-gradients-interpolation-method',
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
