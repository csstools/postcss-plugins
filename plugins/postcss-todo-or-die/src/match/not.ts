import { IfCondition } from '../parse/if';
import { isTokenDimension } from '@csstools/css-tokenizer';

export function matchNotCondition(condition: IfCondition): string | true | undefined {
	const a = condition.a;
	const b = condition.b;
	if (a[0] !== b[0]) {
		return;
	}

	if (
		isTokenDimension(a) &&
		isTokenDimension(b) &&
		a[4].unit.toLowerCase() !== b[4].unit.toLowerCase()
	) {
		return;
	}

	switch (condition.operator) {
		case '<':
			if (a[4].value < b[4].value) {
				return `Died because A (${a[1]}) is less than B (${b[1]})`;
			}
			break;
		case '>':
			if (a[4].value > b[4].value) {
				return `Died because A (${a[1]}) is greater than B (${b[1]})`;
			}
			break;
		case '=':
			if (a[4].value === b[4].value) {
				return `Died because A (${a[1]}) equals B (${b[1]})`;
			}
			break;
	}

	return true;
}
