import { walkerIndexGenerator } from './walker-index-generator';
import type { ComponentValue, ContainerNode } from '../consume/component-block-function';

export function forEach<T extends Record<string, unknown>>(
	componentValues: Array<ComponentValue>,
	cb: (
		entry: {
			node: ComponentValue,
			parent: ContainerNode | { value: Array<ComponentValue> },
			state?: T
		}, index: number | string
	) => boolean | void,
	state?: T,
): false | undefined {

	if (componentValues.length === 0) {
		return;
	}

	const indexGenerator = walkerIndexGenerator(componentValues);

	let index = 0;
	while (index < componentValues.length) {
		const child = componentValues[index];

		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: child, parent: { value: componentValues }, state: stateClone }, index) === false) {
			return false;
		}

		index = indexGenerator(componentValues, child, index);
		if (index === -1) {
			break;
		}
	}
}

export function walk<T extends Record<string, unknown>>(
	componentValues: Array<ComponentValue>,
	cb: (
		entry: {
			node: ComponentValue,
			parent: ContainerNode | { value: Array<ComponentValue> },
			state?: T
		}, index: number | string
	) => boolean | void,
	state?: T,
): false | undefined {
	if (componentValues.length === 0) {
		return;
	}

	forEach(componentValues, (entry, index) => {
		if (cb(entry, index) === false) {
			return false;
		}

		if ('walk' in entry.node && componentValues.includes(entry.node)) {
			if (entry.node.walk(cb, entry.state) === false) {
				return false;
			}
		}
	}, state);
}
