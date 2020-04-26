import postcss from 'postcss'
import options from './options'
import onCSSDeclaration, { placeMatch } from './onCSSDeclaration'

export default postcss.plugin('postcss-place', opts => {
	// prepare options
	if ('preserve' in Object(opts)) options.preserve = Boolean(opts.preserve)

	return root => {
		// walk each matching declaration
		root.walkDecls(placeMatch, onCSSDeclaration)
	}
})
