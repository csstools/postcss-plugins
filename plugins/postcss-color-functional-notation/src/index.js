import postcss from 'postcss'
import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform space and slash separated color functions in CSS. */
const postcssPlugin = postcss.plugin('postcss-color-functional-notation', opts => {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return root => {
		root.walkDecls(onCSSDeclaration)
	}
})

export default postcssPlugin

/** @typedef {import('postcss').Root} CSSRoot */ 
/** @typedef {(root: CSSRoot) => void} PostCSSTransformCallback */ 
/** @typedef {(opts: options) => PostCSSTransformCallback} PostCSSPluginInitializer */ 
