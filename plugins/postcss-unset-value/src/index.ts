import type { PluginCreator } from 'postcss';
import { inherited, nonInherited } from './property-def';

type pluginOptions = {
	// Preserve the original declaration.
	// Default: false
	preserve: boolean;
}

// Convert "unset" to "inherit" or "initial" based on the property definition.
const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({ preserve: false }, opts);

	return {
		postcssPlugin: 'postcss-unset-value',
		Declaration(decl) {
			if (decl.value.toLowerCase() !== 'unset') {
				return;
			}

			let replacement : string|false = false;
			if (inherited.has(decl.prop.toLowerCase())) {
				replacement = 'inherit';
			} else if (nonInherited.has(decl.prop.toLowerCase())) {
				replacement = 'initial';
			}

			if (!replacement) {
				return;
			}

			decl.cloneBefore({ prop: decl.prop, value: replacement });

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

