import type { PluginCreator } from 'postcss';
import { Colord, colord } from 'colord';
import getRgbaVariables from './lib/get-rgba';
import valueParser from 'postcss-value-parser';

function parseColor(color: Colord): string {
	if(!color.isValid()) {
		return;
	}
	const { r, g, b } = color.toRgb();
	return `${r}, ${g}, ${b}`;
}

function getCurrentDeclVariables(decl) {
	console.log(decl.prop, decl.value);
}

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
					// const cssVariables = getCssVariables(root);
					const rgbaVariables = getRgbaVariables(root);
					// console.dir(cssVariables, { depth: null });

					const variablesTree: Map<string, string> = new Map();

					for (const {decl, variableName } of rgbaVariables) {
						decl.parent.walkDecls(currentDecl => {
							// console.log(111, variableName);
							const { prop, value } = currentDecl;
							if (prop === variableName) {
								const currentColor = colord(value);

								if (currentColor.isValid()) {
									variablesTree.set(prop, parseColor(currentColor));
								} else {
									// console.log(1111, currentDecl);
									getCurrentDeclVariables(currentDecl);
								}
							}
						});
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

