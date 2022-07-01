import type { PluginCreator } from 'postcss';
import { transformModFunction, modFunctionCheck } from './mod';
import { transformRemFunction, remFunctionCheck } from './rem';
import { transformRoundFunction, roundFunctionCheck } from './round';

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
				roundFunctionCheck,
			];
			const hasSupportedFunction = checks.some(functionCheck => decl.value.toLowerCase().includes(functionCheck));

			if (!decl || !hasSupportedFunction) {
				return;
			}

			const newDeclaration = decl.clone();

			if (newDeclaration.value.toLowerCase().includes(modFunctionCheck)) {
				const modValue = transformModFunction(newDeclaration, result, options);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			}

			if (newDeclaration.value.toLowerCase().includes(remFunctionCheck)) {
				const modValue = transformRemFunction(newDeclaration, result, options);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			}

			if (newDeclaration.value.toLowerCase().includes(roundFunctionCheck)) {
				const modValue = transformRoundFunction(newDeclaration, result, options);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			}

			if (decl.value === newDeclaration.value) {
				return;
			}

			decl.before(newDeclaration);

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

