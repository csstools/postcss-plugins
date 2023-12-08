/**
 * Generate a function that finds the next element that should be visited when walking an AST.
 * Rules :
 * - the previous iteration is used as a reference, so any checks are relative to the start of the current iteration.
 * - the next element always appears after the current index.
 * - the next element always exists in the list.
 * - replacing an element does not cause the replaced element to be visited.
 * - removing an element does not cause elements to be skipped.
 * - an element added later in the list will be visited.
 */
export function walkerIndexGenerator<T>(initialList: Array<T>) {
	// 1. Keep a reference of the original ordered list.
	let reference: Array<T> = initialList.slice();

	return (list: Array<T>, child: T, index: number): number => {
		// 2. Lookup the index of the original element in the original list.
		const originalElementIndex = reference.indexOf(child);
		let nextIndex = -1;
		// 3. Iterate over the original list from the index of the current element.
		for (let refIndex = originalElementIndex; refIndex < reference.length; refIndex++) {
			// 4. Lookup the index of a potential next element in the new list.
			nextIndex = list.indexOf(reference[refIndex]);

			// 5. If the potential next element is not in the new list, continue.
			if (nextIndex === -1) {
				continue;
			}

			// 6. If the potential next element appears before the current index, continue.
			if (nextIndex < index) {
				continue;
			}

			break;
		}

		// 7. If the next element is not in the list, return -1.
		if (nextIndex === -1) {
			return -1;
		}

		// 8. If the next element is the current element, increment the found index.
		if (nextIndex === index && child === list[index]) {
			nextIndex++;
			if (nextIndex >= list.length) {
				return -1;
			}
		}

		// 9. Update the reference list so that it reflects the current list.
		reference = list.slice();

		// 10. Return the next index.
		return nextIndex;
	};
}
