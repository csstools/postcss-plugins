import postcss from 'postcss'
import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform double-position gradients in CSS. */
const postcssPlugin = postcss.plugin('postcss-double-position-gradients', /** @type {PostCSSPluginInitializer} */ opts => {
	if ('preserve' in Object(opts)) options.preserve = Boolean(opts.preserve)

	return root => {
		root.walkDecls(onCSSDeclaration)
	}
})

export default postcssPlugin

/** @typedef {import('postcss').Root} CSSRoot */ 
/** @typedef {(root: CSSRoot) => void} PostCSSTransformCallback */ 
/** @typedef {(opts: options) => PostCSSTransformCallback} PostCSSPluginInitializer */ 
