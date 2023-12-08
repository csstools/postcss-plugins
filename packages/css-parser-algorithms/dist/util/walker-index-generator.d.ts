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
export declare function walkerIndexGenerator<T>(initialList: Array<T>): (list: Array<T>, child: T, index: number) => number;
