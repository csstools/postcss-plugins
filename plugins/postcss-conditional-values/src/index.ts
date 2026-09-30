import type { Declaration, Root, Rule, PluginCreator, Plugin } from 'postcss';
import valuesParser from 'postcss-value-parser';

// Collect all custom property declarations in the document, grouped by property name.
// This lets us look up the declarations for a conditional variable in constant time
// instead of walking the entire document for every distinct variable.
function collectDeclarationsByProp(root: Root): Map<string, Array<Declaration>> {
	const declarationsByProp = new Map<string, Array<Declaration>>();

	root.walkDecls((decl) => {
		if (decl.prop.length < 2 || decl.prop[0] !== '-' || decl.prop[1] !== '-') {
			return;
		}

		let declarations = declarationsByProp.get(decl.prop);
		if (!declarations) {
			declarations = [];
			declarationsByProp.set(decl.prop, declarations);
		}

		declarations.push(decl);
	});

	return declarationsByProp;
}

export type pluginOptions = {
	functionName: string;
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const pluginOptions = Object.assign({ functionName: 'csstools-if' }, opts);

	return {
		postcssPlugin: 'postcss-conditional-values',
		prepare(): Plugin {
			const counters = new Map<string, number>();
			const didReplaceTrueFalse = new Set<string>();
			const didFindFalse = new Set<string>();
			let declarationsByProp: Map<string, Array<Declaration>> | null = null;
			let rootRule: Rule | undefined;

			return {
				postcssPlugin: 'postcss-conditional-values',
				Declaration(decl, { postcss }): void {
					if (!decl.value.toLowerCase().includes(pluginOptions.functionName)) {
						return;
					}

					const valueAST = valuesParser(decl.value);

					let conditionalVarName = '';
					const truthyValueBuffer: Array<valuesParser.Node> = [];
					let sawElseNode = false;
					const falsyValueBuffer: Array<valuesParser.Node> = [];

					// Gather values:
					{
						valueAST.walk((functionNode) => {
							if (functionNode.type !== 'function' || !functionNode.nodes) {
								return;
							}

							if (functionNode.value.toLowerCase() !== pluginOptions.functionName) {
								return;
							}

							functionNode.nodes.forEach((node) => {
								if (!conditionalVarName && node.type === 'word' && node.value.slice(0, 2) === '--') {
									conditionalVarName = valuesParser.stringify(node).trim();
									return;
								}

								if (!conditionalVarName) {
									return;
								}

								if (node.type === 'word' && node.value === 'else') {
									sawElseNode = true;
									return;
								}

								if (!sawElseNode) {
									truthyValueBuffer.push(node);
									return;
								}

								falsyValueBuffer.push(node);
							});

							return false;
						});
					}

					if (!conditionalVarName) {
						return;
					}

					if (truthyValueBuffer.some((x) => x.type === 'div' && x.value === ',')) {
						return;
					}

					if (falsyValueBuffer.some((x) => x.type === 'div' && x.value === ',')) {
						return;
					}

					const truthyValue = valuesParser.stringify(truthyValueBuffer).trim();
					const falsyValue = valuesParser.stringify(falsyValueBuffer).trim();
					if (!truthyValue || !falsyValue) {
						return;
					}

					// Value toggles:
					{
						const counter = counters.get(conditionalVarName) || 0;
						counters.set(conditionalVarName, counter + 1);

						const varName = `${conditionalVarName}--${counter}`;

						decl.cloneBefore({
							prop: varName,
							value: `var(${conditionalVarName}) ${falsyValue}`,
						});

						valueAST.walk((functionNode) => {
							if (functionNode.type !== 'function' || !functionNode.nodes) {
								return;
							}

							if (functionNode.value.toLowerCase() !== pluginOptions.functionName) {
								return;
							}

							functionNode.value = 'var';
							functionNode.nodes = [
								...valuesParser(varName).nodes,
								{
									sourceIndex: 0,
									sourceEndIndex: 1,
									value: ',',
									type: 'div',
									before: '',
									after: '',
								},
								...valuesParser(truthyValue).nodes,
							];

							return false;
						});

						decl.cloneBefore({
							value: valueAST.toString(),
						});
					}

					// Control toggles:
					{
						if (!didReplaceTrueFalse.has(conditionalVarName)) {
							if (!declarationsByProp) {
								declarationsByProp = collectDeclarationsByProp(decl.root());
							}

							const conditionalVarDeclarations = declarationsByProp.get(conditionalVarName) || [];
							for (let i = 0; i < conditionalVarDeclarations.length; i++) {
								const otherDecl = conditionalVarDeclarations[i];

								if (otherDecl.value.trim() === '') {
									didFindFalse.add(conditionalVarName);
									continue;
								}

								if (otherDecl.value.trim().toLowerCase() === 'true') {
									otherDecl.value = 'initial';
								} else if (otherDecl.value.trim().toLowerCase() === 'false') {
									otherDecl.value = ' ';
									didFindFalse.add(conditionalVarName);
								}
							}

							didReplaceTrueFalse.add(conditionalVarName);

							if (!didFindFalse.has(conditionalVarName)) {
								didFindFalse.add(conditionalVarName);

								if (!rootRule) {
									decl.root().each((node) => {
										if (node.type === 'rule' && node.selector === ':root') {
											rootRule = node;
											return false;
										}
									});
								}

								if (!rootRule) {
									rootRule = postcss.rule({
										selector: ':root',
										source: decl.source,
										raws: {
											before: '',
											after: '\n',
											between: ' ',
										},
									});

									decl.root().prepend(rootRule);
								}

								const falseDecl = postcss.decl({
									value: ' ',
									prop: conditionalVarName,
									raws: {
										before: '\n\t',
									},
								});
								falseDecl.source = decl.source;

								rootRule.append(falseDecl);
							}
						}
					}

					decl.remove();
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
