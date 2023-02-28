import { xyz } from '@csstools/color-helpers';

export function serialize_sRGB_data(x) {
	if (!x || x === -1) {
		return '';
	}

	const srgb = xyz.XYZ_D50_to_sRGB(x.channels).map((channel) => {
		return Math.min(255, Math.max(0, Math.round(toPrecision(channel) * 255)));
	});

	x.alpha = Math.min(1, Math.max(0, toPrecision(x.alpha)));

	if (x.alpha === 1) {
		return `rgb(${srgb[0]}, ${srgb[1]}, ${srgb[2]})`;
	}

	return `rgba(${srgb[0]}, ${srgb[1]}, ${srgb[2]}, ${x.alpha})`;
}

function toPrecision(n, precision = 7) {
	n = +n;
	precision = +precision;
	let integerLength = (Math.floor(n) + '').length;

	if (precision > integerLength) {
		return +n.toFixed(precision - integerLength);
	} else {
		let p10 = 10 ** (integerLength - precision);
		return Math.round(n / p10) * p10;
	}
}
