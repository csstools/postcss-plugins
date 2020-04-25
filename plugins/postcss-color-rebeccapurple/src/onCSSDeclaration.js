import { parse } from 'postcss-values-parser'
import onCSSIdentifier from './onCSSIdentifier'
import options from './options'

/** @type {(decl: CSSDeclaration) => void} Transform the rebeccapurple keyword in CSS Declarations. */
const onCSSDeclaration = decl => {
	const { value: originalValue } = decl

	if (hasAnyRebeccapurple(originalValue)) {
		const valueAST = parse(originalValue)

		valueAST.walkType('word', onCSSIdentifier)

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

/** Return whether the value has a rebeccapurple keyword. */
const hasAnyRebeccapurple = createRegExpTest(/(^|[^\w-])rebeccapurple([^\w-]|$)/i)

/** @typedef {import('postcss').Declaration} CSSDeclaration */
