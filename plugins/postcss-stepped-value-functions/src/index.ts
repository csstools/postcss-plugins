import type { PluginCreator } from 'postcss';
import { transformModFunction, modFunctionCheck } from './mod';
import { transformRemFunction, remFunctionCheck } from './rem';

export type pluginOptions = { preserve?: boolean, onInvalid?: string };

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
			onInvalid: '',
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-stepped-value-functions',
		Declaration(decl, { result }) {
			const checks = [
				modFunctionCheck,
				remFunctionCheck,
			];
			const hasSupportedFunction = checks.some(functionCheck => decl.value.includes(functionCheck));

			if (!decl || !hasSupportedFunction) {
				return;
			}

			const newDeclaration = decl.clone();

			if (decl.value.includes(modFunctionCheck)) {
				const modValue = transformModFunction(newDeclaration, result, options);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			}

			if (newDeclaration.value.includes(remFunctionCheck)) {
				const modValue = transformRemFunction(newDeclaration, result, options);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			}

			if (decl.value !== newDeclaration.value) {
				if (options.preserve) {
					decl.cloneBefore({ value: newDeclaration.value });
				} else {
					decl.value = newDeclaration.value;
				}
			}
		},
	};
};

creator.postcss = true;

export default creator;

