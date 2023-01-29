
/** Returns the string as an encoded CSS identifier. */
export default function encodeCSS(value) {
	if (value === '') {
		return '';
	}

	let hex;
	let result = '';
	for (let i = 0; i < value.length; i++) {
		hex = value.charCodeAt(i).toString(36);
		if (i === 0) {
			result += hex;
		} else {
			result += '-' + hex;
		}
	}

	return 'csstools-has-' + result;
}
