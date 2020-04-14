import postcss from 'postcss'
import options from './options'
import onRule, { selectorRegExp } from './onRule'

/** @type {CSSPlugin} */ 
const plugin = postcss.plugin('postcss-focus-visible', opts => {
	opts = Object(opts)
	options.replaceWith = String(opts.replaceWith || '.focus-visible')
	options.preserve = Boolean('preserve' in opts ? opts.preserve : true)

	return root => {
		root.walkRules(selectorRegExp, onRule)
	}
})

export default plugin

/** @typedef {import('postcss').Plugin<options>} CSSPlugin */
