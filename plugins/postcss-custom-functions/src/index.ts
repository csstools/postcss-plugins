import type { Plugin, PluginCreator } from 'postcss';
import type { CustomFunctionGroup } from './custom-functions-from-root';
import { getCustomFunctions, removeUnusedCustomFunctions } from './custom-functions-from-root';
import { isProcessableDeclaration } from './is-processable-declaration';
import { CustomFunctionTranspiler } from './transpile';

/** postcss-custom-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

/** Characters that can not be part of a `<dashed-function>` name. */
const CUSTOM_FUNCTION_NAME_DELIMITERS = ':; \t\n\r\f(){}[]';

/**
 * Whether a value contains a `<dashed-function>` call.
 */
function hasCustomFunction(value: string): boolean {
	for (let i = 0; i < value.length; i++) {
		if (value[i] !== '-' || value[i + 1] !== '-') {
			continue;
		}

		i += 2;

		let end = i;
		while (end < value.length && !CUSTOM_FUNCTION_NAME_DELIMITERS.includes(value[end])) {
			end++;
		}

		if (value[end] === '(') {
			return true;
		}

		i = end;
	}

	return false;
}

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
			let customFunctions: Map<string, CustomFunctionGroup> = new Map();
			const transpiler = new CustomFunctionTranspiler();

			return {
				postcssPlugin: 'postcss-custom-functions',
				Once(root, helpers): void {
					customFunctions = getCustomFunctions(root, helpers.result);

					if (!options.preserve) {
						removeUnusedCustomFunctions(root, customFunctions);
					}

					transpiler.setCustomFunctions(customFunctions);
				},
				OnceExit(root): void {
					for (const registration of transpiler.getRegisteredPropertyAtRules()) {
						root.append(registration);
					}
				},
				Declaration(decl, helpers): void {
					if (!hasCustomFunction(decl.value)) {
						return;
					}

					if (!isProcessableDeclaration(decl, customFunctions)) {
						return;
					}

					const result = transpiler.processDeclaration(decl, helpers);

					if (result.emittedNodes.length && decl.parent) {
						decl.parent.before(result.emittedNodes);
					}

					if (result.inlineDecls.length) {
						decl.before(result.inlineDecls);
					}

					if (result.value === null) {
						return;
					}

					decl.cloneBefore({ value: result.value });

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
