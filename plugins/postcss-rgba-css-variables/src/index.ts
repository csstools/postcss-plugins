import type { PluginCreator, Rule } from 'postcss';
import getRgbaVariables from './lib/get-rgba';
import { COMMON_VARIABLES_KEY, cssVariablesRegExp } from './lib/utils';
import getColorVariablesTree from './lib/get-color-variables-tree';

type pluginOptions = {
	mode?: 'replace-directly' | 'replace-required' | 'replace-all';
	preserve?: boolean;
};

const creator: PluginCreator<pluginOptions> = (options?: pluginOptions) => {
	const {
		mode = 'replace-directly',
		preserve = true,
	} = {...options};

	console.log(mode, preserve);

	return {
		postcssPlugin: 'postcss-rgba-css-variables',
		prepare() {
			return {
				Once: root => {
					const colorVariablesTree = getColorVariablesTree(root);
					const rgbaVariables = getRgbaVariables(root);

					// mode === replace-required
					const clonedDeclList: Set<string> = new Set();

					if (mode === 'replace-all') {
						for (const rules of colorVariablesTree.values()) {
							for (const [variableName, { parsedValue, decl }] of rules) {
								if(!parsedValue) {
									continue;
								}

								decl.cloneAfter({
									prop: `${variableName}-rgb`,
									value: parsedValue,
								});
							}
						}
					}

					for (const { variableName, decl } of rgbaVariables.values()) {
						const { selector } = decl.parent as Rule;
						const variableParsed = colorVariablesTree.get(selector)?.get(variableName) || colorVariablesTree.get(COMMON_VARIABLES_KEY)?.get(variableName);

						// console.log(333, variableName, variableParsed?.value);

						if (variableParsed && variableParsed.parsedValue) {
							// console.log(decl.value.replace(cssVariablesRegExp, variableParsed.parsedValue));

							if (mode === 'replace-directly') {
								decl.cloneAfter({
									value: decl.value.replace(cssVariablesRegExp, variableParsed.parsedValue),
								});
							}

							if (mode === 'replace-required') {
								const newProp = `${variableName}-rgb`;
								if (!clonedDeclList.has(newProp)) {
									variableParsed.decl.cloneAfter({
										prop: newProp,
										value: variableParsed.parsedValue,
									});
									clonedDeclList.add(newProp);
								}

								decl.cloneAfter({
									value: decl.value.replace(cssVariablesRegExp, `var(${variableName}-rgb)`),
								});
							}

							if (mode === 'replace-all') {
								decl.cloneAfter({
									value: decl.value.replace(cssVariablesRegExp, `var(${variableName}-rgb)`),
								});
							}

							if (preserve) {
								continue;
							}

							decl.remove();
						}
					}


				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

