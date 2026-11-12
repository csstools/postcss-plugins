import type { AtRule, ChildNode, Container, Declaration, Document } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import type { CustomFunctionGroup } from './custom-functions-from-root';
import { isFunctionNode, isTokenNode, parseListOfComponentValues, walk } from '@csstools/css-parser-algorithms';
import { isTokenDimension, tokenize } from '@csstools/css-tokenizer';
import { parameterType } from './classify';
import { hasImportant, parseArguments } from './parse-arguments';
import { isGeneratedProperty } from './generated-names';

const blockedParentAtRules = new Set(['function', 'keyframes']);
const contextSensitiveProperty = /^(font-size|font|line-height)$/i;
const fontRelativeUnits = new Set(['em', 'ex', 'cap', 'ch', 'ic', 'lh', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax']);
const lineHeightRelativeUnits = new Set(['lh', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax']);

export function isProcessableDeclaration(decl: Declaration, customFunctions?: Map<string, CustomFunctionGroup>): boolean {
	if (isGeneratedProperty(decl.prop)) {
		return false;
	}

	if (decl.value.includes('!') && hasInvalidImportantArgument(decl.value)) {
		return false;
	}

	if (customFunctions && contextSensitiveProperty.test(decl.prop)) {
		const units = decl.prop.toLowerCase() === 'line-height' ? lineHeightRelativeUnits : fontRelativeUnits;
		if (valueHasRiskyTypedCall(decl.value, customFunctions, units, new Set())) {
			return false;
		}
	}

	if (!decl.parent || decl.parent.type !== 'rule') {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && blockedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}

function hasInvalidImportantArgument(value: string): boolean {
	const componentValues = parseListOfComponentValues(tokenize({ css: value }));
	let found = false;

	walk(componentValues, (entry) => {
		if (!isFunctionNode(entry.node) || !entry.node.getName().startsWith('--')) {
			return;
		}

		if (hasImportant(entry.node.value)) {
			found = true;
		}
	});

	return found;
}

function valueHasRiskyTypedCall(value: string, customFunctions: Map<string, CustomFunctionGroup>, units: Set<string>, seen: Set<string>): boolean {
	const componentValues = parseListOfComponentValues(tokenize({ css: value }));
	let risky = false;

	walk(componentValues, (entry) => {
		if (risky || !isFunctionNode(entry.node)) {
			return;
		}

		const name = entry.node.getName();
		if (!name.startsWith('--')) {
			return;
		}

		const group = customFunctions.get(name);
		if (!group || !group.supported) {
			return;
		}

		if (groupHasRiskyTypedArgument(entry.node, group, units)) {
			risky = true;
			return;
		}

		if (seen.has(name)) {
			return;
		}

		seen.add(name);

		for (const definition of group.definitions) {
			definition.node.walkDecls((decl) => {
				if (!risky && valueHasRiskyTypedCall(decl.value, customFunctions, units, seen)) {
					risky = true;
				}
			});
		}
	});

	return risky;
}

function groupHasRiskyTypedArgument(fn: FunctionNode, group: CustomFunctionGroup, units: Set<string>): boolean {
	const args = parseArguments(fn);
	if (!args) {
		return false;
	}

	for (const definition of group.definitions) {
		const parameters = definition.function.parameters;

		for (let i = 0; i < parameters.length && i < args.length; i++) {
			if (parameterType(parameters[i]) && hasRiskyArgument(args[i], units)) {
				return true;
			}
		}
	}

	return false;
}

function hasRiskyArgument(componentValues: Array<ComponentValue>, units: Set<string>): boolean {
	let risky = false;

	walk(componentValues, (entry) => {
		if (risky) {
			return;
		}

		if (isTokenNode(entry.node)) {
			if (isTokenDimension(entry.node.value) && units.has(entry.node.value[4].unit.toLowerCase())) {
				risky = true;
			}

			return;
		}

		if (!isFunctionNode(entry.node)) {
			return;
		}

		const name = entry.node.getName().toLowerCase();
		if (name === 'var' || name === 'if' || name === 'inherit' || name === 'env' || name === 'attr' || name.startsWith('--')) {
			risky = true;
		}
	});

	return risky;
}
