import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform 4 & 8 character hex color notation in CSS. */
export default function postcssColorHexAlpha(/** @type {PostCSSPluginInitializer} */ opts) {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return {
		postcssPlugin: 'postcss-color-hex-alpha',
		Declaration: onCSSDeclaration
	}
}

postcssColorHexAlpha.postcss = true
