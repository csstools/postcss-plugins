import type { PluginCreator } from 'postcss';
import { inherited, nonInherited } from './property-def';

type pluginOptions = {
	// Preserve the original declaration.
	// Default: false
	preserve: boolean;
}

// Convert "unset" to "inherit" or "initial" based on the property.
const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({ preserve: false }, opts);

	return {
		postcssPlugin: 'postcss-unset',
		Declaration(decl) {
			if (decl.value !== 'unset') {
				return;
			}

			let replacement : string|false = false;
			if (inherited.has(decl.prop)) {
				replacement = 'inherit';
			} else if (nonInherited.has(decl.prop)) {
				replacement = 'initial';
			}

			if (!replacement) {
				return;
			}

			if (options.preserve) {
				decl.cloneBefore({ prop: decl.prop, value: replacement });
			} else {
				decl.value = replacement;
			}
		},
	};
};

creator.postcss = true;

export default creator;

