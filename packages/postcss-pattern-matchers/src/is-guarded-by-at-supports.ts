import type { AtRule, ChildNode, Container, Document, Declaration, Rule } from 'postcss';
import { supportConditionsFromValue } from './support-conditions-from-values';
import { supportConditionsForSelectorFromAtSupports, supportConditionsFromSelector } from './support-conditions-from-selectors';

export function declarationIsGuardedByAtSupports(decl: Declaration, valueConditions?: Array<string>): boolean {
	valueConditions = valueConditions || supportConditionsFromValue(decl.value);
	if (!valueConditions.length) {
		return false;
	}

	const valueConditionsFound = new Set();

	let parent: Document | Container<ChildNode> = decl.parent;
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

export function selectorIsGuardedByAtSupports(rule: Rule, selectorConditions?: Array<string>): boolean {
	selectorConditions = selectorConditions || supportConditionsFromSelector(rule.selector);
	if (!selectorConditions.length) {
		return false;
	}

	const selectorConditionsFound = new Set();

	let parent: Document | Container<ChildNode> = rule.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports') {
			const parentConditions = supportConditionsForSelectorFromAtSupports((parent as AtRule).params);
			parentConditions.forEach((parentCondition) => {
				if (selectorConditions.includes(parentCondition)) {
					selectorConditionsFound.add(parentCondition);
				}
			});
		}

		parent = parent.parent;
	}

	return selectorConditionsFound.size === selectorConditions.length;
}
