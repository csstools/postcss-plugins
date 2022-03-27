
/** Decodes an identifier back into a CSS selector */
export default function decodeCSS(value) {
	if (value.slice(0, 13) !== 'csstools-has-') {
		return '';
	}

	value = value.slice(13);
	let values = value.split('-');

	let result = '';
	for (let i = 0; i < values.length; i++) {
		result += String.fromCharCode(parseInt(values[i], 36));
	}

	return result;
}
