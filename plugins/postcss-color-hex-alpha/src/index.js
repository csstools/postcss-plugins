import postcss from 'postcss'
import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform 4 & 8 character hex color notation in CSS. */
const postcssPlugin = postcss.plugin('postcss-color-hex-alpha', /** @type {PostCSSPluginInitializer} */ opts => {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return root => {
		root.walkDecls(onCSSDeclaration)
	}
})

export default postcssPlugin
