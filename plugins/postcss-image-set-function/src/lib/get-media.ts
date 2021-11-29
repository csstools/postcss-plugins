import type { Node, Numeric } from '@csstools/postcss-plugins-values-parser';

const dpiRatios = { dpcm: 2.54, dpi: 1, dppx: 96, x: 96 };

// return a valid @media rule
export function getMedia(dpi: number | false, postcss) {
	if (typeof dpi === 'boolean') {
		return false;
	}

	// calculate min-device-pixel-ratio and min-resolution
	const dpr = Math.floor(dpi / dpiRatios.x * 100) / 100;

	const media = postcss.atRule({
		name: 'media',
		params: `(-webkit-min-device-pixel-ratio: ${dpr}), (min-resolution: ${dpi}dpi)`,
	});

	return media;
}

export function getMediaDPI(node: Node) {
	if (Object(node).type !== 'numeric') {
		return false;
	}

	const numeric = node as Numeric;

	if (numeric.unit in dpiRatios) {
		// calculate min-device-pixel-ratio and min-resolution
		return Number(numeric.value) * dpiRatios[numeric.unit.toLowerCase()];
	} else {
		return false;
	}
}
