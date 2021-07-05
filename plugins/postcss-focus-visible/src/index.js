
import options from './options'
import onRule, { selectorRegExp } from './onRule'

/** @type {CSSPlugin} */
const plugin = opts => {
	opts = Object(opts)
	options.replaceWith = String(opts.replaceWith || '.focus-visible')
	options.preserve = Boolean('preserve' in opts ? opts.preserve : true)

	return {
		postcssPlugin: 'postcss-focus-visible',
		Rule (rule) {
			if (selectorRegExp.test(rule.selector)) {
				onRule(rule)
			}
		}
	}
}

plugin.postcss = true

export default plugin

/** @typedef {import('postcss').Plugin<options>} CSSPlugin */
