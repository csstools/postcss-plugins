import options from './options'

/** @type {(rule: CSSRule) => void} */
const onRule = rule => {
	const selector = rule.selector.replace(selectorRegExp, ($0, $1) => `${options.replaceWith}${$1}`)

	// check if it was processed yet
	if (options.preserve && rule.prev()?.selector === selector) return

	const clone = rule.clone({ selector })

	if (options.preserve) rule.before(clone)
	else rule.replaceWith(clone)
}

export const selectorRegExp = /(?<!\\):focus-visible([^\w-]|$)/gi

export default onRule

/** @typedef {import('postcss').Rule} CSSRule */
