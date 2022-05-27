import type { AtRule, ChildNode, Container, Node, Document, Declaration, Rule } from 'postcss';
import { supportConditionsFromValue } from './support-conditions-from-values';
import { supportConditionsFromSelector } from './support-conditions-from-selectors';

export function isGuardedByAtSupports(node: Node, valueConditions: Array<string>): boolean {
	const valueConditionsFound = new Set();

	let parent : Document | Container<ChildNode> = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports') {
			const parentConditions = supportConditionsFromValue((parent as AtRule).params);
			parentConditions.forEach((parentCondition) => {
				if (valueConditions.includes(parentCondition)) {
					valueConditionsFound.add(parentCondition);
				}
			});
		}

		parent = parent.parent;
	}

	return valueConditionsFound.size === valueConditions.length;
}

export function declarationIsGuardedByAtSupports(decl: Declaration): boolean {
	const valueConditions = supportConditionsFromValue(decl.value);
	if (!valueConditions.length) {
		return false;
	}

	return isGuardedByAtSupports(decl, valueConditions);
}

export function selectorIsGuardedByAtSupports(rule: Rule): boolean {
	const valueConditions = supportConditionsFromSelector(rule.selector);
	if (!valueConditions.length) {
		return false;
	}

	return isGuardedByAtSupports(rule, valueConditions);
}
