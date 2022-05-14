import type { AtRule, ChildNode, Container, Declaration, Document } from 'postcss';
import { supportConditionsFromValue } from './support-conditions-from-values';

export function isGuardedByAtSupports(decl: Declaration, valueConditions: Array<string>): boolean {
	const valueConditionsFound = new Set();

	let parent : Document | Container<ChildNode> = decl.parent;
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
