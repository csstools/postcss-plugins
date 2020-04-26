import { parse } from 'postcss-values-parser'
import onCSSFunction from './onCSSFunction'
import options from './options'

/** @type {(decl: CSSDeclaration) => void} Transform double-position gradients in CSS Declarations. */
const onCSSDeclaration = decl => {
	const { value: originalValue } = decl

	if (hasGradientFunction(originalValue)) {
		const valueAST = parse(originalValue, { ignoreUnknownWords: true })

		valueAST.walkType('func', onCSSFunction)

		const modifiedValue = String(valueAST)

		if (modifiedValue !== originalValue) {
			if (options.preserve) decl.cloneBefore({ value: modifiedValue })
			else decl.value = modifiedValue
		}
	}
}

export default onCSSDeclaration

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the value has a lab() or lch() function. */
const hasGradientFunction = createRegExpTest(/(repeating-)?(conic|linear|radial)-gradient\([\W\w]*\)/i)

/** @typedef {import('postcss').Declaration} CSSDeclaration */
