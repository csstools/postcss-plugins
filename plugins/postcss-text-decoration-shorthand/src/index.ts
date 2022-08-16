import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';

type pluginOptions = { color?: string, preserve?: boolean };

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
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

					if (relevantNodes.length > 4) {
						return;
					}

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
						line: null,
						style: null,
						color: null,
						thickness: null,
					};

					for (let i = 0; i < relevantNodes.length; i++) {
						const currentNode = relevantNodes[i];

						if (currentNode.type === 'word' && lineKeywords.includes(currentNode.value.toLowerCase())) {
							data.line = currentNode;
							continue;
						}

						if (currentNode.type === 'word' && styleKeywords.includes(currentNode.value.toLowerCase())) {
							data.style = currentNode;
							continue;
						}

						if (nodeIsAColor(currentNode)) {
							data.color = currentNode;
							continue;
						}

						if (currentNode.type === 'word' && currentNode.value.toLowerCase() === 'none') {
							if (!data.color) {
								data.color = currentNode;
							}

							if (!data.line) {
								data.line = currentNode;
							}

							continue;
						}

						data.thickness = currentNode;
					}

					if (!data.line) {
						data.line = {
							type: 'word',
							value: 'none',
						};
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

					try {
						const valueAndUnit = valueParser.unit(data.thickness.value);
						if (valueAndUnit && valueAndUnit.unit === '%') {
							data.thickness = {
								type: 'function',
								value: 'calc',
								nodes: [
									{ type: 'word',value: '0.01em' },
									{ type: 'space', value: ' ' },
									{ type: 'word', value: '*' },
									{ type: 'space', value: ' ' },
									{ type: 'word', value: valueAndUnit.number },
								],
							};
						}
					} catch (_) {
						// Ignore errors.
					}

					const nonShortHandValue = valueParser.stringify(data.line);
					if (decl.value.toLowerCase() === nonShortHandValue) {
						return;
					}

					const shortHandValue = valueParser.stringify([
						data.line,
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

					decl.cloneBefore({
						prop: 'text-decoration',
						value: nonShortHandValue,
					});

					// Construct a new shorthand value without thickness:
					// - when thickness is set
					// - when not all shorthand properties are set
					if (data.thickness || relevantNodes.length !== 3) {
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

	if ('word' === node.type && namedColors.includes(node.value.toLowerCase())) {
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

const namedColors = [
	'currentcolor',

	'aliceblue',
	'antiquewhite',
	'aqua',
	'aquamarine',
	'azure',
	'beige',
	'bisque',
	'black',
	'blanchedalmond',
	'blue',
	'blueviolet',
	'brown',
	'burlywood',
	'cadetblue',
	'chartreuse',
	'chocolate',
	'coral',
	'cornflowerblue',
	'cornsilk',
	'crimson',
	'cyan',
	'darkblue',
	'darkcyan',
	'darkgoldenrod',
	'darkgray',
	'darkgreen',
	'darkgrey',
	'darkkhaki',
	'darkmagenta',
	'darkolivegreen',
	'darkorange',
	'darkorchid',
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkslategrey',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dimgrey',
	'dodgerblue',
	'firebrick',
	'floralwhite',
	'forestgreen',
	'fuchsia',
	'gainsboro',
	'ghostwhite',
	'gold',
	'goldenrod',
	'gray',
	'green',
	'greenyellow',
	'grey',
	'honeydew',
	'hotpink',
	'indianred',
	'indigo',
	'ivory',
	'khaki',
	'lavender',
	'lavenderblush',
	'lawngreen',
	'lemonchiffon',
	'lightblue',
	'lightcoral',
	'lightcyan',
	'lightgoldenrodyellow',
	'lightgray',
	'lightgreen',
	'lightgrey',
	'lightpink',
	'lightsalmon',
	'lightseagreen',
	'lightskyblue',
	'lightslategray',
	'lightslategrey',
	'lightsteelblue',
	'lightyellow',
	'lime',
	'limegreen',
	'linen',
	'magenta',
	'maroon',
	'mediumaquamarine',
	'mediumblue',
	'mediumorchid',
	'mediumpurple',
	'mediumseagreen',
	'mediumslateblue',
	'mediumspringgreen',
	'mediumturquoise',
	'mediumvioletred',
	'midnightblue',
	'mintcream',
	'mistyrose',
	'moccasin',
	'navajowhite',
	'navy',
	'oldlace',
	'olive',
	'olivedrab',
	'orange',
	'orangered',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
	'rebeccapurple',
	'red',
	'rosybrown',
	'royalblue',
	'saddlebrown',
	'salmon',
	'sandybrown',
	'seagreen',
	'seashell',
	'sienna',
	'silver',
	'skyblue',
	'slateblue',
	'slategray',
	'slategrey',
	'snow',
	'springgreen',
	'steelblue',
	'tan',
	'teal',
	'thistle',
	'tomato',
	'turquoise',
	'violet',
	'wheat',
	'white',
	'whitesmoke',
	'yellow',
	'yellowgreen',
];
