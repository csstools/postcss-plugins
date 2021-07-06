import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin = /** @type {PostCSSPluginInitializer} */ opts => {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration: onCSSDeclaration,
	}
}

postcssPlugin.postcss = true

export default postcssPlugin

/** @typedef {import('postcss').Plugin} PostCSSPlugin */
/** @typedef {(opts: options) => PostCSSPlugin} PostCSSPluginInitializer */
