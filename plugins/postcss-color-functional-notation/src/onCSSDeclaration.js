import { parse } from 'postcss-values-parser'
import onCSSFunction from './onCSSFunction'
import options from './options'

/** @type {(decl: CSSDeclaration) => void} Transform space and slash separated color functions in CSS Declarations. */
const onCSSDeclaration = decl => {
	const { value: originalValue } = decl

	if (hasAnyColorFunction(originalValue)) {
		const valueAST = parse(originalValue)

		valueAST.walkFuncs(onCSSFunction)

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

/** Return whether the value has an `hsl()`, `hsla()`, `rgb()`, or `rgba()` function. */
const hasAnyColorFunction = createRegExpTest(/(^|[^\w-])(hsla?|rgba?)\(/i)

/** @typedef {import('postcss').Declaration} CSSDeclaration */
