import type { ComponentValue } from '../consume/component-block-function';
import { walk } from './walk';

/**
 * Replace specific component values in a list of component values.
 * A helper for the most common and simplistic cases when mutating an AST.
 */
export function replaceComponentValues(
	componentValuesList: Array<Array<ComponentValue>>,
	replaceWith: (componentValue: ComponentValue) => Array<ComponentValue> | ComponentValue | void,
): Array<Array<ComponentValue>> {
	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValues = componentValuesList[i];

		walk(componentValues, (entry, index) => {
			if (typeof index !== 'number') {
				return;
			}

			const replacement = replaceWith(entry.node);
			if (!replacement) {
				return;
			}

			if (Array.isArray(replacement)) {
				entry.parent.value.splice(index, 1, ...replacement);
			} else {
				entry.parent.value.splice(index, 1, replacement);
			}
		});
	}

	return componentValuesList;
}
