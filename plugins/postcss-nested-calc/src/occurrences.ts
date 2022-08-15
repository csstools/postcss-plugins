// check for "calc("
// - case insensitive
// - multiline
// - multiple matches
const calcExpressionRegExp = /calc\(/gim;

export function numberOfCalcOccurrences(value: string): number {
	return (value.match(calcExpressionRegExp) || []).length;
}
