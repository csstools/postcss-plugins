// check for "calc("
// - case insensitive
// - multiline
const CALC_EXPRESSION_REGEX = /calc\(/gi;

export function numberOfCalcOccurrences(value: string): number {
	return (value.match(CALC_EXPRESSION_REGEX) || []).length;
}
