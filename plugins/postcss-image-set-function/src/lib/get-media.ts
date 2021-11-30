import type { Node } from 'postcss-value-parser';

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
	if (!node) {
		return false;
	}

	if (node.type !== 'word') {
		return false;
	}

	const unit = node.value.replace(/^(\d+)/, '');
	if (unit === node.value) {
		// No numeric value found.
		return false;
	}

	const value = node.value.slice(0, -unit.length);

	if (unit.toLowerCase() in dpiRatios) {
		// calculate min-device-pixel-ratio and min-resolution
		return Number(value) * dpiRatios[unit.toLowerCase()];
	} else {
		return false;
	}
}
