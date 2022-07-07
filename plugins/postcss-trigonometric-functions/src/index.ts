import type { PluginCreator } from 'postcss';
import { sinFunctionCheck, transformSinFunction } from './sin';
import { cosFunctionCheck, transformCosFunction } from './cos';
import { tanFunctionCheck, transformTanFunction } from './tan';
import { asinFunctionCheck, transformAsinFunction } from './asin';
import { acosFunctionCheck, transformAcosFunction } from './acos';
import { atanFunctionCheck, transformAtanFunction } from './atan';
import { atan2FunctionCheck, transformAtan2Function } from './atan2';

type pluginOptions = { preserve?: boolean };

const Transformations = [
	{ check: asinFunctionCheck, transform: transformAsinFunction },
	{ check: acosFunctionCheck, transform: transformAcosFunction },
	{ check: atanFunctionCheck, transform: transformAtanFunction },
	{ check: atan2FunctionCheck, transform: transformAtan2Function },
	{ check: sinFunctionCheck, transform: transformSinFunction },
	{ check: cosFunctionCheck, transform: transformCosFunction },
	{ check: tanFunctionCheck, transform: transformTanFunction },
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
				transformation => decl.value.toLowerCase().includes(transformation.check),
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

