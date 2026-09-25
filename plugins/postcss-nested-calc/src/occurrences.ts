export function numberOfCalcOccurrences(value: string): number {
	// Count occurrences without materializing an array of all matches.
	// The regex is created per call so no `lastIndex` state is shared between calls.
	const regex = /calc\(/gi;

	let count = 0;
	while (regex.exec(value)) {
		count++;
	}

	return count;
}
