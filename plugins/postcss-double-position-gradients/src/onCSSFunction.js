import Punctuation from 'postcss-values-parser/lib/nodes/Punctuation';

/** @type {(decl: CSSFunction) => void} Transform lab() and lch() functions. */
const onCSSFunction = func => {
	/** @type {{ name: string, nodes: CSSNode[] }} */
	const { name, nodes } = func
	
	if (isGradientFunctionName(name)) {
		nodes.slice(0).forEach((node, index, nodes) => {
			const node1back = Object(nodes[index - 1]);
			const node2back = Object(nodes[index - 2]);
			const node1next = Object(nodes[index + 1]);

			const isDoublePositionLength = node2back.type && node1back.type === 'numeric' && node.type === 'numeric';

			// if the argument concludes a double-position gradient
			if (isDoublePositionLength) {
				// insert the fallback colors
				const color = node2back.clone();
				const comma = new Punctuation({ value: ',', raws: isPunctuationCommaNode(node1next) ? { ...node1next.clone().raws } : { before: '', after: '' } })

				func.insertBefore(node, [comma, color]);
			}
		})
	}
}

export default onCSSFunction

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the function name is `lab` or `lch`. */
const isGradientFunctionName = createRegExpTest(/^(repeating-)?(conic|linear|radial)-gradient$/i)

const isPunctuationCommaNode = node => node.type === 'punctuation' && node.value === ','
