export function splitByComma(string, isTrimmed) {
	return splitByRegExp(string, /^,$/, isTrimmed);
}

export function splitBySpace(string, isTrimmed) {
	return splitByRegExp(string, /^\s$/, isTrimmed);
}

export function splitBySlash(string, isTrimmed) {
	return splitByRegExp(string, /^\/$/, isTrimmed);
}

function splitByRegExp(string, re, isTrimmed) {
	const array = [];
	let buffer = '';
	let split = false;
	let func = 0;
	let i = -1;

	while (++i < string.length) {
		const char = string[i];

		if (char === '(') {
			func += 1;
		} else if (char === ')') {
			if (func > 0) {
				func -= 1;
			}
		} else if (func === 0) {
			if (re.test(char)) {
				split = true;
			}
		}

		if (split) {
			if (!isTrimmed || buffer.trim()) {
				array.push(isTrimmed ? buffer.trim() : buffer);
			}

			if (!isTrimmed) {
				array.push(char);
			}

			buffer = '';
			split = false;
		} else {
			buffer += char
		}
	}

	if (buffer !== '') {
		array.push(isTrimmed ? buffer.trim() : buffer);
	}

	return array;
}
