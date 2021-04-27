export const split = (string, separators, last) => {
	let array = []
	let current = ''
	let split = false

	let func = 0
	let quote = false
	let escape = false

	for (let letter of string) {
		if (escape) {
			escape = false
		} else if (letter === '\\') {
			escape = true
		} else if (quote) {
			if (letter === quote) {
				quote = false
			}
		} else if (letter === '"' || letter === "'") {
			quote = letter
		} else if (letter === '(') {
			func += 1
		} else if (letter === ')') {
			if (func > 0) func -= 1
		} else if (func === 0) {
			if (separators.includes(letter)) split = true
		}

		if (split) {
			if (current !== '') array.push(current.trim())
			current = ''
			split = false
		} else {
			current += letter
		}
	}

	if (last || current !== '') array.push(current.trim())
	return array
}

export const comma = (string) => split(string, [','], true)

export const space = (string) => split(string, [' ', '\n', '\t'])
