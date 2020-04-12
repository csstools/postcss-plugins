import { parse } from 'postcss-values-parser'
import onFunction from './onFunction'
import options from './options'

/** @type {(decl: CSSDeclaration) => void} Transform lab() and lch() functions in CSS Declarations. */
const visitor = decl => {
	const { value } = decl

	if (hasAnyColorFunction(value)) {
		const valueAST = parse(value)

		valueAST.walkFuncs(onFunction)

		const newValue = String(valueAST)

		if (options.preserve) decl.cloneBefore({ value: newValue })
		else decl.value = newValue
	}
}

export default visitor

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the value has a lab() or lch() function. */
const hasAnyColorFunction = createRegExpTest(/(^|[^\w-])(lab|lch)\(/i)

/** @typedef {import('postcss').Declaration} CSSDeclaration */
