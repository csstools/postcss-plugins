const INVALID_SELECTOR_CHAR = [
	' ', // Can't use child selector
	'>', // Can't use direct child selector
	'~', // Can't use sibling selector
	':', // Can't use pseudo selector
	'+', // Can't use adjacent selector
	'@', // Can't use at
	'#', // Can't use id selector
	'(', // Can't use parenthesis
	')', // Can't use parenthesis
];

export default function isValidReplacement(selector) {
	let isValid = true;

	// Purposely archaic so it's interoperable in old browsers
	for (let i = 0, length = INVALID_SELECTOR_CHAR.length; i < length && isValid; i++) {
		if (selector.indexOf(INVALID_SELECTOR_CHAR[i]) > -1) {
			isValid = false;
		}
	}

	return isValid;
}
