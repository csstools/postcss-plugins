export function comma(string: string) {
	const array: Array<string> = [];
	let current = '';
	let split = false;

	let func = 0;
	let quote: string|false = false;
	let escape = false;

	for (const letter of string) {
		if (escape) {
			escape = false;
		} else if (letter === '\\') {
			escape = true;
		} else if (quote) {
			if (letter === quote) {
				quote = false;
			}
		} else if (letter === '"' || letter === '\'') {
			quote = letter;
		} else if (letter === '(') {
			func += 1;
		} else if (letter === ')') {
			if (func > 0) {
				func -= 1;
			}
		} else if (func === 0) {
			if (letter === ',') {
				split = true;
			}
		}

		if (split) {
			if (current !== '') {
				array.push(current.trim());
			}
			current = '';
			split = false;
		} else {
			current += letter;
		}
	}

	array.push(current.trim());
	return array;
}
