import { xyz } from '@csstools/color-helpers';

export function serialize_sRGB_data(x) {
	if (!x || x === -1) {
		return '';
	}

	const srgb = xyz.XYZ_D50_to_sRGB(x.channels);
	if (x.alpha === 1) {
		return `rgb(${Math.round(srgb[0] * 255)}, ${Math.round(srgb[1] * 255)}, ${Math.round(srgb[2] * 255)})`;
	}

	return `rgba(${Math.round(srgb[0] * 255)}, ${Math.round(srgb[1] * 255)}, ${Math.round(srgb[2] * 255)}, ${x.alpha})`;
}
