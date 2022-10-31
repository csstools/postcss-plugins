import { Root, Rule, Declaration } from 'postcss';
import { colord } from 'colord';
import valueParser from 'postcss-value-parser';
import { parseColor, isRootRule, COMMON_VARIABLES_KEY, getValueFromParsedVariable } from './utils';

type VariableType = {
	value: string,
	parsedValue?: string,
	decl: Declaration,
};

type VariableTypeMap = Map<string, VariableType>;

type OutputType = Map<string, VariableTypeMap>;

export default function getColorVariablesTree(root: Root): OutputType {
	const output: OutputType = new Map();

	root.walkDecls(decl => {
		// console.dir(decl.parent, { depth: null });
		// console.log(isRootRule((decl.parent as Rule).selector));
		if (decl.variable) {
			// console.dir(decl, { depth: null });
			const { selector } = decl.parent as Rule;
			const isRoot = isRootRule(selector);
			const ruleName = isRoot ? COMMON_VARIABLES_KEY : selector;
			if (!output.has(ruleName)) {
				output.set(ruleName, new Map());
			}

			const ruleTree = output.get(ruleName);

			const { prop, value } = decl;
			// console.log(prop, value);

			const currentValue = colord(value);
			const parsedValue = parseColor(currentValue);

			if (parsedValue) {
				ruleTree.set(prop, {
					value,
					parsedValue,
					decl,
				});

				return;
			}

			const valueFromParsedVariable = getValueFromParsedVariable(valueParser(value));

			if (valueFromParsedVariable) {
				ruleTree.set(prop, {
					value: valueFromParsedVariable,
					decl,
				});

				return;
			}

		}
	});

	for (const tree of output.values()) {
		for (const info of tree.values()) {
			const { value, parsedValue } = info;

			if(parsedValue) {
				continue;
			}

			const currentParsedValue = traversalTreeGetParsedValue(value, tree, output.get(COMMON_VARIABLES_KEY));

			if (!currentParsedValue) {
				continue;
			}

			info.parsedValue = currentParsedValue;
		}
	}

	// console.log(output);

	return output;
}


function traversalTreeGetParsedValue(
	value: string,
	tree: VariableTypeMap,
	root: VariableTypeMap,
): string | undefined {
	const target = tree?.get(value) || root?.get(value);
	if(!target) {
		return;
	}
	const { parsedValue } = target;
	if(parsedValue) {
		return parsedValue;
	}

	return traversalTreeGetParsedValue(target.value, tree, root);
}
