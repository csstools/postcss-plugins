import type { Declaration, Plugin, PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';
import { namedColors } from '@csstools/color-helpers';

/** postcss-text-decoration-shorthand plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
};

const IS_TEXT_DECORATION_REGEX = /^text-decoration$/i;

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
		prepare(): Plugin {
			const convertedValues : Map<string, string> = new Map();

			return {
				postcssPlugin: 'postcss-text-decoration-shorthand',
				OnceExit(): void {
					convertedValues.clear();
				},
				Declaration(decl): void {
					if (!IS_TEXT_DECORATION_REGEX.test(decl.prop)) {
						return;
					}

					const parent = decl.parent;
					if (!parent) {
						return;
					}

					const ownIndex = parent.index(decl);

					const siblingTextDecorationProperties = parent.nodes.filter((node) => {
						return node.type === 'decl' &&
							IS_TEXT_DECORATION_REGEX.test(node.prop) &&
							parent.index(node) !== ownIndex;
					}) as Array<Declaration>;

					if (siblingTextDecorationProperties.some((node) => {
						return convertedValues.get(decl.value) === node.value;
					})) {
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

					const data: {
						line: Array<valueParser.Node>,
						style: valueParser.Node|null,
						color: valueParser.Node|null,
						thickness: valueParser.Node|null,
					} = {
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
							} catch {
								return;
							}

							if (!valueAndUnit || !valueAndUnit.unit) {
								return;
							}

							data.thickness = currentNode;

							if (valueAndUnit.unit === '%') {
								data.thickness = {
									...genericNodeParts(),
									type: 'function',
									value: 'calc',
									nodes: [
										{ ...genericNodeParts(), type: 'word', value: '0.01em' },
										{ ...genericNodeParts(), type: 'space', value: ' ' },
										{ ...genericNodeParts(), type: 'word', value: '*' },
										{ ...genericNodeParts(), type: 'space', value: ' ' },
										{ ...genericNodeParts(), type: 'word', value: valueAndUnit.number },
									],
								};
							}

							continue;
						}

						return;
					}

					if (!data.line.length) {
						data.line.push({
							...genericNodeParts(),
							type: 'word',
							value: 'none',
						});
					}

					if (!data.style) {
						data.style = {
							...genericNodeParts(),
							type: 'word',
							value: 'solid',
						};
					}

					if (!data.color) {
						data.color = {
							...genericNodeParts(),
							type: 'word',
							value: 'currentColor',
						};
					}

					const nonShortHandValue = valueParser.stringify(data.line);
					convertedValues.set(decl.value, nonShortHandValue);

					if (siblingTextDecorationProperties.some((node) => {
						return convertedValues.get(decl.value) === node.value;
					})) {
						return;
					}

					if (decl.value.toLowerCase() === nonShortHandValue.toLowerCase()) {
						let next = decl.next();
						while (next && next.type === 'comment') {
							next = next.next();
						}

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
							...genericNodeParts(),
							type: 'space',
							value: ' ',
						},
						data.style,
						{
							...genericNodeParts(),
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
export { creator as 'module.exports' };

function nodeIsAColor(node: valueParser.Node): boolean {
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
	'color',
	'color-mix',
	'hsl',
	'hsla',
	'hwb',
	'lab',
	'lch',
	'oklab',
	'oklch',
	'rgb',
	'rgba',
];

const colorNames = [
	'currentcolor',
	'transparent',

	...Object.keys(namedColors),
];

function genericNodeParts(): { before: '', after: '', sourceIndex: 0, sourceEndIndex: 0 } {
	return {
		before: '',
		after: '',
		sourceIndex: 0,
		sourceEndIndex: 0,
	};
}
