import type { ComponentValue } from '../consume/component-block-function';
import { isFunctionNode, isSimpleBlockNode } from './type-predicates';

/**
 * Replace specific component values in a list of component values.
 * A helper for the most common and simplistic cases when mutating an AST.
 */
export function replaceComponentValues(
	componentValuesList: Array<Array<ComponentValue>>,
	replaceWith: (componentValue: ComponentValue) => ComponentValue | void,
) {
	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValues = componentValuesList[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			{
				const replacement = replaceWith(componentValue);
				if (replacement) {
					componentValues.splice(j, 1, replacement);
					continue;
				}
			}

			if (isSimpleBlockNode(componentValue) || isFunctionNode(componentValue)) {
				componentValue.walk((entry, index) => {
					if (typeof index !== 'number') {
						return;
					}

					const node = entry.node;
					const replacement = replaceWith(node);
					if (replacement) {
						entry.parent.value.splice(index, 1, replacement);
						return;
					}
				});
			}
		}
	}

	return componentValuesList;
}
