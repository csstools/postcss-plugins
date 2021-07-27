import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform the rebeccapurple keyword in CSS. */
function postcssColorRebeccaPurple(opts) {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return {
		postcssPlugin: 'postcss-color-rebeccapurple',
		Declaration: onCSSDeclaration
	}
}

postcssColorRebeccaPurple.postcss = true

export default postcssColorRebeccaPurple
