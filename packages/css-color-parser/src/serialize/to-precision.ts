export function toPrecision(n: number, precision = 7): number {
	n = +n;
	precision = +precision;
	const integerLength = (Math.floor(Math.abs(n)) + '').length;

	if (precision > integerLength) {
		return +n.toFixed(precision - integerLength);
	} else {
		const p10 = 10 ** (integerLength - precision);
		return Math.round(n / p10) * p10;
	}
}
