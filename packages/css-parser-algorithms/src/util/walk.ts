import { walkerIndexGenerator } from './walker-index-generator';
import type { ComponentValue, ContainerNode } from '../consume/component-block-function';

/**
 * Iterates over each item in a list of component values.
 *
 * @param cb - The callback function to execute for each item.
 * The function receives an object containing the current node (`node`), its parent (`parent`),
 * and an optional `state` object.
 * A second parameter is the index of the current node.
 * The function can return `false` to stop the iteration.
 *
 * @param state - An optional state object that can be used to pass additional information to the callback function.
 * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
 *
 * @returns `false` if the iteration was halted, `undefined` otherwise.
 */
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

/**
 * Walks each item in a list of component values all of their children.
 *
 * @param cb - The callback function to execute for each item.
 * The function receives an object containing the current node (`node`), its parent (`parent`),
 * and an optional `state` object.
 * A second parameter is the index of the current node.
 * The function can return `false` to stop the iteration.
 *
 * @param state - An optional state object that can be used to pass additional information to the callback function.
 * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
 * However changes are passed down to child node iterations.
 *
 * @returns `false` if the iteration was halted, `undefined` otherwise.
 *
 * @example
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseListOfComponentValues, isSimpleBlockNode } from '@csstools/css-parser-algorithms';
 *
 * const myCSS = `calc(1px * (5 / 2)) 10px`;
 *
 * const componentValues = parseListOfComponentValues(tokenize({ css: myCSS }));
 *
 * let state = { inSimpleBlock: false };
 * walk(componentValues, (entry) => {
 * 	if (isSimpleBlockNode(entry)) {
 * 		entry.state.inSimpleBlock = true;
 * 		return;
 * 	}
 *
 * 	if (entry.state.inSimpleBlock) {
 * 		console.log(entry.node.toString()); // `5`, ...
 * 	}
 * }, state);
 * ```
 */
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
