import type { PluginCreator, Rule } from 'postcss';
import { Colord, colord } from 'colord';
import getRgbaVariables from './lib/get-rgba';
import { COMMON_VARIABLES_KEY } from './lib/utils';
import getColorVariablesTree from './lib/get-color-variables-tree';
import valueParser from 'postcss-value-parser';

type pluginOptions = {
	mode?: 'replace-directly' | 'replace-required' | 'replace-all';
	preserve?: boolean;
};

const creator: PluginCreator<pluginOptions> = (options?: pluginOptions) => {
	const {
		mode = 'replace-directly',
		preserve = false,
	} = {...options};

	console.log(mode, preserve);

	return {
		postcssPlugin: 'postcss-rgba-css-variables',
		prepare() {
			return {
				Once: root => {
					const colorVariablesTree = getColorVariablesTree(root);
					console.log(1111, colorVariablesTree);
					// console.dir(colorVariablesTree, { depth: null });
					// const cssVariables = getCssVariables(root);
					const rgbaVariables = getRgbaVariables(root);
					// console.dir(cssVariables, { depth: null });
					console.log(2222, rgbaVariables);
					// console.dir(rgbaVariables, { depth: null });

					for (const { variableName, decl } of rgbaVariables.values()) {
						const { selector } = decl.parent as Rule;
						const variableParsed = colorVariablesTree.get(selector)?.get(variableName) || colorVariablesTree.get(COMMON_VARIABLES_KEY)?.get(variableName);

						console.log(333, variableName, variableParsed?.parsedValue);

						if (variableParsed && variableParsed.parsedValue) {
							console.log(decl.value.replace(/var\(([^()]*?--[^()]*)\)/, variableParsed.parsedValue));
							decl.cloneAfter({
								value: decl.value.replace(/var\(([^()]*?--[^()]*)\)/, variableParsed.parsedValue),
							});
						}
					}
				},
			};
		},

		// Declaration(decl) {
		// 	console.log(1111, decl);
		// 	if (decl.value === 'red') {
		// 		// Determine the new value.
		// 		let newValue = 'blue';
		// 		if (options.color) {
		// 			newValue = options.color;
		// 		}

		// 		// Check if it is different from the current value.
		// 		if (newValue === decl.value) {
		// 			return;
		// 		}

		// 		// Insert the new value before the current value.
		// 		decl.cloneBefore({
		// 			prop: 'color',
		// 			value: newValue,
		// 		});

		// 		// If the current value is preserved we are done and return here.
		// 		if (options.preserve) {
		// 			return;
		// 		}

		// 		// If the current value is not preserved we remove it.
		// 		decl.remove();
		// 	}
		// },
	};
};

creator.postcss = true;

export default creator;

