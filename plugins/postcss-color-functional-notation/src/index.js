import onCSSDeclaration from './onCSSDeclaration'
import options from './options'

/** Transform space and slash separated color functions in CSS. */
export default function postcssColorFunctionalNotation(opts) {
	options.preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false

	return {
		postcssPlugin: 'postcss-color-functional-notation',
		Declaration: onCSSDeclaration
	}
}

postcssColorFunctionalNotation.postcss = true

/** @typedef {import('postcss').Root} CSSRoot */
/** @typedef {(root: CSSRoot) => void} PostCSSTransformCallback */
/** @typedef {(opts: options) => PostCSSTransformCallback} PostCSSPluginInitializer */
