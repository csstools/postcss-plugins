import postcss from 'postcss'
import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform the rebeccapurple keyword in CSS. */
const postcssPlugin = postcss.plugin('postcss-lab-function', /** @type {PostCSSPluginInitializer} */ opts => {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return root => {
		root.walkDecls(onCSSDeclaration)
	}
})

export default postcssPlugin
