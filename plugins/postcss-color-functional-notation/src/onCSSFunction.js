import { parse } from 'postcss-values-parser'

/** @type {(decl: CSSFunction) => void} Transform a space and slash separated color function. */
const onCSSFunction = node => {
	/** @type {{ name: string, nodes: CSSNode[] }} */
	const { name, nodes } = node

	if (isColorFunctionName(name)) {
		const isHsl = isHslColorFunctionName(name) && isHslFunctionContents(nodes)
		const isRgbWithNumbers = isRgbColorFunctionName(name) && isRgbNumberFunctionContents(nodes)
		const isRgbWithPercents = isRgbColorFunctionName(name) && isRgbPercentFunctionContents(nodes)

		if (name === 'hsl' && !isHsl) {
			console.log([name, isHue(nodes[0])], nodes[0])
		}

		if (isHsl || isRgbWithNumbers || isRgbWithPercents) {
			// rename the Color function to `hsl` or `rgb`
			Object.assign(node, { name: isHsl ? 'hsl' : 'rgb' })

			/** @type {CSSPunctuation} Slash punctuation before the Alpha channel. */
			const slashNode = nodes[3]

			/** @type {CSSNumber} Alpha channel. */
			const alphaNode = nodes[4]

			if (alphaNode) {
				if (isPercentage(alphaNode) && !isCalc(alphaNode)) {
					// transform the Alpha channel from a Percentage to (0-1) Number
					Object.assign(alphaNode, { value: String(alphaNode.value / 100), unit: '' })
				}

				// if the color is fully opaque (i.e. the Alpha channel is `1`)
				if (alphaNode.value === '1') {
					// remove the Slash and Alpha channel
					slashNode.remove()
					alphaNode.remove()
				} else {
					// otherwise, rename the Color function to `hsla` or `rgba`
					Object.assign(node, { name: isHsl ? 'hsla' : 'rgba' })
				}
			}

			// replace a remaining Slash with a Comma
			if (slashNode && isSlash(slashNode)) {
				slashNode.replaceWith(commaNode.clone())
			}

			/** Extracted Color channels. */
			let [channelNode1, channelNode2, channelNode3] = nodes

			if (isRgbWithPercents) {
				Object.assign(channelNode1, { value: to255ColorValue(channelNode1.value), unit: '' })
				Object.assign(channelNode2, { value: to255ColorValue(channelNode2.value), unit: '' })
				Object.assign(channelNode3, { value: to255ColorValue(channelNode3.value), unit: '' })
			}

			channelNode2.after(
				commaNode.clone()
			)

			channelNode1.after(
				commaNode.clone()
			)
		}
	}
}

export default onCSSFunction

const commaNode = parse(',').first

/** Return a value transformed from a scale of 0-100 to a scale of 0-255 */
function to255ColorValue(value) {
	return String(Math.floor(value * 255 / 100))
}

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the function name is `hsl()`, `hsla()`, `rgb()`, or `rgba()`. */
const isColorFunctionName = createRegExpTest(/^(hsl|rgb)a?$/i)

/** Return whether the function name is `hsl()` or `hsla()`. */
const isHslColorFunctionName = createRegExpTest(/^hsla?$/i)

/** Return whether the function name is `rgb()` or `rgba()`. */
const isRgbColorFunctionName = createRegExpTest(/^rgba?$/i)

/** Return whether the function name is `calc`. */
const isCalcFunctionName = createRegExpTest(/^calc$/i)

/** Return whether the unit is alpha-like. */
const isAlphaLikeUnit = createRegExpTest(/^%?$/i)

/** Return whether the unit is hue-like. */
const isHueLikeUnit = createRegExpTest(/^(deg|grad|rad|turn)?$/i)

/** @type {(node: CSSNumber) => boolean} Return whether the node is an Alpha-like unit. */
const isAlphaValue = node => isCalc(node) || node.type === 'numeric' && isAlphaLikeUnit(node.unit)

/** @type {(node: CSSFunction) => boolean} Return whether the node is a calc() function. */
const isCalc = node => node.type === 'func' && isCalcFunctionName(node.name)

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Hue-like unit. */
const isHue = node => isCalc(node) || node.type === 'numeric' && isHueLikeUnit(node.unit)

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Number unit. */
const isNumber = node => isCalc(node) || node.type === 'numeric' && node.unit === ''

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Percentage unit. */
const isPercentage = node => isCalc(node) || node.type === 'numeric' && (node.unit === '%' || node.unit === '' && node.value === '0')

/** @type {(node: CSSOperator) => boolean} Return whether the node is a Slash delimiter. */
const isSlash = node => node.type === 'operator' && node.value === '/'

/** @type {(nodes: Node[]) => boolean} Return whether a set of nodes is an hsl() function. */
const isHslFunctionContents = nodes => nodes.every(
	(node, index) => typeof hslFunctionContents[index] === 'function' && hslFunctionContents[index](node)
)

/** Set of nodes in a lab() function. */
const hslFunctionContents = [isHue, isPercentage, isPercentage, isSlash, isAlphaValue]

/** @type {(nodes: Node[]) => boolean} Return whether a set of nodes is an rgb() function with numbers. */
const isRgbNumberFunctionContents = nodes => nodes.every(
	(node, index) => typeof rgbNumberFunctionContents[index] === 'function' && rgbNumberFunctionContents[index](node)
)

/** Set of nodes in a rgb() function with numbers. */
const rgbNumberFunctionContents = [isNumber, isNumber, isNumber, isSlash, isAlphaValue]

/** @type {(nodes: Node[]) => boolean} Return whether a set of nodes is an rgb() function with percentages. */
const isRgbPercentFunctionContents = nodes => nodes.every(
	(node, index) => typeof rgbPercentFunctionContents[index] === 'function' && rgbPercentFunctionContents[index](node)
)

/** Set of nodes in a rgb() function with percentages. */
const rgbPercentFunctionContents = [isPercentage, isPercentage, isPercentage, isSlash, isAlphaValue]

/** @typedef {import('postcss-values-parser').Func} CSSFunction */
/** @typedef {import('postcss-values-parser').Node} CSSNode */
/** @typedef {import('postcss-values-parser').Numeric} CSSNumber */
/** @typedef {import('postcss-values-parser').Operator} CSSOperator */
/** @typedef {import('postcss-values-parser').Punctuation} CSSPunctuation */
