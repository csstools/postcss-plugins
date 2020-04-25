/** @type {(decl: CSSIdentifier) => void} Transform the rebeccapurple keyword. */
const onCSSIdentifier = node => {
	if (isRebeccaPurple(node.value)) node.value = '#639'
}

export default onCSSIdentifier

/** @type {(value: RegExp) => (value: string) => boolean} Return a function that checks whether the expression exists in a value. */
const createRegExpTest = Function.bind.bind(RegExp.prototype.test)

/** Return whether the value is rebeccapurple. */
const isRebeccaPurple = createRegExpTest(/^rebeccapurple$/i)
