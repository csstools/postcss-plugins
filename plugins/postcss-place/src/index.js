import options from './options';
import onCSSDeclaration, { placeMatch } from './onCSSDeclaration';

const creator = opts => {
	// prepare options
	if ('preserve' in Object(opts)) {
		options.preserve = Boolean(opts.preserve);
	}

	return {
		postcssPlugin: 'postcss-place',
		Declaration: (decl, { result }) => {
			if (placeMatch.test(decl.prop.toLowerCase())) {
				onCSSDeclaration(decl, { result });
			}
		},
	};
};

creator.postcss = true;

export default creator;
