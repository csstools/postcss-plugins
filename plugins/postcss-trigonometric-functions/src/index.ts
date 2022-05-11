import type { PluginCreator } from 'postcss';
import { sinFunctionCheck, transformSinFunction } from './sin';
import { cosFunctionCheck, transformCosFunction } from './cos';
import { tanFunctionCheck, transformTanFunction } from './tan';
import { asinFunctionCheck, transformAsinFunction } from './asin';

type pluginOptions = { preserve?: boolean };

const Transformations = [
	{ check: sinFunctionCheck, transform: transformSinFunction },
	{ check: cosFunctionCheck, transform: transformCosFunction },
	{ check: tanFunctionCheck, transform: transformTanFunction },
	{ check: asinFunctionCheck, transform: transformAsinFunction },
];

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-trigonometric-functions',
		Declaration(decl) {
			const transformations = Transformations.filter(
				transformation => decl.value.includes(transformation.check),
			);

			if (!decl || transformations.length === 0) {
				return;
			}

			const newDeclaration = decl.clone();

			transformations.forEach(transformation => {
				const modValue = transformation.transform(newDeclaration);

				if (modValue) {
					newDeclaration.value = modValue;
				}
			});

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

