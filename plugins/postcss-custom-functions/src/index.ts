import type { Plugin, PluginCreator } from 'postcss';
import type { CustomFunctionAndNode } from './custom-functions-from-root';
import { getCustomFunctions } from './custom-functions-from-root';
import { isProcessableDeclaration } from './is-processable-declaration';
import { CustomFunctionTranspiler } from './transpile';

/** postcss-custom-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const HAS_CUSTOM_FUNCTION = /--.*?\(/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-custom-functions',
		prepare(): Plugin {
			let customFunctions: Map<string, CustomFunctionAndNode> = new Map();
			const transpiler = new CustomFunctionTranspiler();

			return {
				postcssPlugin: 'postcss-custom-functions',
				Once(root, { result }): void {
					customFunctions = getCustomFunctions(root, result, { preserve: options.preserve });
					transpiler.setCustomFunctions(customFunctions);
				},
				OnceExit(root): void {
					for (const registration of transpiler.getRegistrations()) {
						root.append(registration);
					}
				},
				Declaration(decl): void {
					if (!HAS_CUSTOM_FUNCTION.test(decl.value)) {
						return;
					}

					if (!isProcessableDeclaration(decl)) {
						return;
					}

					const modified = transpiler.processDeclaration(decl);
					if (modified === null) {
						return;
					}

					decl.cloneBefore({ value: modified });

					if (!options.preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
