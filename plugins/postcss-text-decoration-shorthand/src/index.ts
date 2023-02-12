import { namedColors } from '@csstools/color-helpers';
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';

/** postcss-text-decoration-shorthand plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: true,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-text-decoration-shorthand',
		prepare() {
			const convertedValues : Map<string, string> = new Map();

			return {
				OnceExit: () => {
					convertedValues.clear();
				},
				Declaration: (decl) => {
					if (decl.prop.toLowerCase() !== 'text-decoration') {
						return;
					}

					const ownIndex = decl.parent.index(decl);
					const hasFallbacksOrOverrides = decl.parent.nodes.some((node) => {
						return node.type === 'decl' &&
							node.prop.toLowerCase() === 'text-decoration' &&
							convertedValues.get(decl.value) === node.value &&
							decl.parent.index(node) !== ownIndex;
					});
					if (hasFallbacksOrOverrides) {
						return;
					}

					const valueAST = valueParser(decl.value);
					const relevantNodes = valueAST.nodes.filter((node) => {
						return node.type !== 'space' && node.type !== 'comment';
					});

					if (relevantNodes.find((node) => {
						return node.value.toLowerCase() === 'var' && node.type === 'function';
					})) {
						return;
					}

					if (relevantNodes.find((node) => {
						return node.type === 'word' && cssWideKeywords.includes(node.value);
					})) {
						return;
					}

					const data = {
						line: [],
						style: null,
						color: null,
						thickness: null,
					};

					for (let i = 0; i < relevantNodes.length; i++) {
						const currentNode = relevantNodes[i];

						if (!data.line.length && currentNode.type === 'word' && lineKeywords.includes(currentNode.value.toLowerCase())) {
							const startNode = currentNode;
							let endNode = currentNode;

							// eslint-disable-next-line no-constant-condition
							while (true) {
								const nextNode = relevantNodes[i + 1];
								if (nextNode && nextNode.type === 'word' && lineKeywords.includes(nextNode.value.toLowerCase())) {
									endNode = nextNode;
									i++;
									continue;
								}

								break;
							}

							data.line = valueAST.nodes.slice(
								valueAST.nodes.indexOf(startNode),
								valueAST.nodes.indexOf(endNode) + 1,
							);

							continue;
						}

						if (!data.line.length && currentNode.type === 'word' && currentNode.value.toLowerCase() === 'none') {
							data.line.push(currentNode);
							continue;
						}

						if (!data.style && currentNode.type === 'word' && styleKeywords.includes(currentNode.value.toLowerCase())) {
							data.style = currentNode;
							continue;
						}

						if (!data.thickness && currentNode.type === 'word' && thicknessKeywords.includes(currentNode.value.toLowerCase())) {
							data.thickness = currentNode;
							continue;
						}

						if (!data.thickness && currentNode.type === 'function' && currentNode.value.toLowerCase() === 'calc') {
							data.thickness = currentNode;
							continue;
						}

						if (!data.color && nodeIsAColor(currentNode)) {
							data.color = currentNode;
							continue;
						}

						if (currentNode.type === 'word') {
							let valueAndUnit;
							try {
								valueAndUnit = valueParser.unit(currentNode.value);
							} catch (_) {
								return;
							}

							if (!valueAndUnit || !valueAndUnit.unit) {
								return;
							}

							data.thickness = currentNode;

							if (valueAndUnit.unit === '%') {
								data.thickness = {
									type: 'function',
									value: 'calc',
									nodes: [
										{ type: 'word', value: '0.01em' },
										{ type: 'space', value: ' ' },
										{ type: 'word', value: '*' },
										{ type: 'space', value: ' ' },
										{ type: 'word', value: valueAndUnit.number },
									],
								};
							}

							continue;
						}

						return;
					}

					if (!data.line.length) {
						data.line.push({
							type: 'word',
							value: 'none',
						});
					}

					if (!data.style) {
						data.style = {
							type: 'word',
							value: 'solid',
						};
					}

					if (!data.color) {
						data.color = {
							type: 'word',
							value: 'currentColor',
						};
					}

					const nonShortHandValue = valueParser.stringify(data.line);
					if (decl.value.toLowerCase() === nonShortHandValue.toLowerCase()) {
						const next = decl.next();
						if (!next || next.type !== 'decl' || next.prop.toLowerCase() !== 'text-decoration') {

							// "-webkit-text-decoration" is a shorthand and sets omitted constituent properties to their initial value.
							// "text-decoration" is a longhand in older browsers and does not have this behavior.
							decl.cloneBefore({
								prop: '-webkit-text-decoration',
								value: nonShortHandValue,
							});
						}

						return;
					}

					decl.cloneBefore({
						prop: 'text-decoration',
						value: nonShortHandValue,
					});

					const shortHandValue = valueParser.stringify([
						...data.line,
						{
							type: 'space',
							value: ' ',
						},
						data.style,
						{
							type: 'space',
							value: ' ',
						},
						data.color,
					]);

					if (data.thickness) {
						decl.cloneBefore({
							prop: 'text-decoration',
							value: shortHandValue,
						});
					}

					if (data.thickness) {
						decl.cloneBefore({
							prop: 'text-decoration-thickness',
							value: valueParser.stringify([
								data.thickness,
							]),
						});
					}

					convertedValues.set(decl.value, nonShortHandValue);
					convertedValues.set(shortHandValue, nonShortHandValue);

					if (!options.preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

function nodeIsAColor(node) {
	if ('word' === node.type && node.value.startsWith('#')) {
		return true;
	}

	if ('word' === node.type && colorNames.includes(node.value.toLowerCase())) {
		return true;
	}

	if ('function' === node.type && colorFunctions.includes(node.value.toLowerCase())) {
		return true;
	}

	return false;
}


// css wide keywords
const cssWideKeywords = [
	'unset',
	'inherit',
	'initial',
	'revert',
	'revert-layer',
];

// line
// none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error
const lineKeywords = [
	'underline',
	'overline',
	'line-through',
	'blink',
	'spelling-error',
	'grammar-error',
];

// style
// solid | double | dotted | dashed | wavy
const styleKeywords = [
	'solid',
	'double',
	'dotted',
	'dashed',
	'wavy',
];

// thickness
// auto | from-font
const thicknessKeywords = [
	'auto',
	'from-font',
];

const colorFunctions = [
	'rgb',
	'rgba',
	'hsl',
	'hsla',
	'hwb',
	'lch',
	'lab',
	'color',
	'oklch',
	'oklab',
];

const colorNames = [
	'currentcolor',
	'transparent',

	...Object.keys(namedColors),
];
