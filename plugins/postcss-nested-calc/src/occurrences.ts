export function numberOfOccurrences(value: string, search: RegExp): number {
	return (value.match(search) || []).length;
}
