import postcss from 'postcss'
import onDeclaration from './onDeclaration'
import options from './options'

/** Transform lab() and lch() functions in CSS. */
const plugin = postcss.plugin('postcss-lab-function', /** @type {PostCSSPluginInitializer} */ opts => {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return root => {
		root.walkDecls(onDeclaration)
	}
})

export default plugin

/** @typedef {import('postcss').Root} CSSRoot */ 
/** @typedef {(root: CSSRoot) => void} PostCSSTransformCallback */ 
/** @typedef {(opts: options) => PostCSSTransformCallback} PostCSSPluginInitializer */ 
