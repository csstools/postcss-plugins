import { lab2rgb, lch2rgb } from '@csstools/convert-colors'
import { parse } from 'postcss-values-parser'

/** @type {(decl: CSSFunction) => void} Transform lab() and lch() functions. */
const visitor = node => {
	/** @type {{ name: string, nodes: CSSNode[] }} */
	const { name, nodes } = node

	if (isColorFunctionName(name)) {
		if (isLabFunctionContents(nodes) || isLchFunctionContents(nodes)) {
			// rename the Color function to `rgb`
			Object.assign(node, { name: 'rgb' })

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
					// otherwise, rename the Color function to `rgba`
					Object.assign(node, { name: 'rgba' })
				}
			}

			// replace a remaining Slash with a Comma
			if (slashNode && isSlash(slashNode)) {
				slashNode.replaceWith(commaNode.clone())
			}

			/** Extracted Color channels. */
			const [channelNode1, channelNode2, channelNode3] = nodes

			/** Corresponding Color transformer. */
			const toRGB = isLabColorFunctionName(name) ? lab2rgb : lch2rgb

			/** RGB channels from the source color. */
			const rgbValues = toRGB(
				...[
					channelNode1.value,
					channelNode2.value,
					channelNode3.value
				].map(
					channelNumber => parseFloat(channelNumber)
				)
			).map(
				channelValue => Math.max(Math.min(parseInt(channelValue * 2.55), 255), 0)
			)

			channelNode3.replaceWith(
				channelNode3.clone({ value: String(rgbValues[2]) })
			)

			channelNode2.replaceWith(
				channelNode2.clone({ value: String(rgbValues[1]) }),
				commaNode.clone()
			)

			channelNode1.replaceWith(
				channelNode1.clone({ value: String(rgbValues[0]), unit: '' }),
				commaNode.clone()
			)
		}
	}
}

export default visitor

const commaNode = parse(',').first

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the function name is `lab` or `lch`. */
const isColorFunctionName = createRegExpTest(/^(lab|lch)$/i)

/** Return whether the function name is `calc`. */
const isCalcFunctionName = createRegExpTest(/^calc$/i)

/** Return whether the function name is `lab`. */
const isLabColorFunctionName = createRegExpTest(/^lab$/i)

/** Return whether the unit is alpha-like. */
const isAlphaLikeUnit = createRegExpTest(/^%?$/i)

/** Return whether the unit is hue-like. */
const isHueLikeUnit = createRegExpTest(/^(deg|grad|rad|turn)?$/i)

/** @type {(node: CSSFunction) => boolean} Return whether the node is an Alpha-like unit. */
const isAlphaValue = node => isCalc(node) || node.type === 'numeric' && isAlphaLikeUnit(node.unit)

/** @type {(node: CSSFunction) => boolean} Return whether the node is a calc() function. */
const isCalc = node => node.type === 'func' && isCalcFunctionName(node.name)

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Hue-like unit. */
const isHue = node => isCalc(node) || node.type === 'numeric' && isHueLikeUnit(node.unit)

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Number unit. */
const isNumber = node => isCalc(node) || node.type === 'numeric' && node.unit === ''

/** @type {(node: CSSNumber) => boolean} Return whether the node is a Percentage unit. */
const isPercentage = node => isCalc(node) || node.type === 'numeric' && node.unit === '%'

/** @type {(node: CSSOperator) => boolean} Return whether the node is a Slash delimiter. */
const isSlash = node => node.type === 'operator' && node.value === '/'

/** @type {(nodes: Node[]) => boolean} Return whether a set of nodes is a lab() function. */
const isLabFunctionContents = nodes => nodes.every(
	(node, index) => typeof labFunctionContents[index] === 'function' && labFunctionContents[index](node)
)

/** Set of nodes in a lab() function. */
const labFunctionContents = [isPercentage, isNumber, isNumber, isSlash, isAlphaValue]

/** @type {(nodes: Node[]) => boolean} Return whether a set of nodes is a lch() function. */
const isLchFunctionContents = nodes => nodes.every(
	(node, index) => typeof lchFunctionContents[index] === 'function' && lchFunctionContents[index](node)
)

/** Set of nodes in a lch() function. */
const lchFunctionContents = [isPercentage, isNumber, isHue, isSlash, isAlphaValue]

/** @typedef {import('postcss-values-parser').Func} CSSFunction */
/** @typedef {import('postcss-values-parser').Node} CSSNode */
/** @typedef {import('postcss-values-parser').Numeric} CSSNumber */
/** @typedef {import('postcss-values-parser').Operator} CSSOperator */
/** @typedef {import('postcss-values-parser').Punctuation} CSSPunctuation */
