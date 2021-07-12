const postcss = require('postcss');

const dpiRatios = { dpcm: 2.54, dpi: 1, dppx: 96, x: 96 };

// return a valid @media rule
module.exports = (node, mediasByDpr) => {
	if (Object(node).type === 'numeric' && node.unit in dpiRatios) {
		// calculate min-device-pixel-ratio and min-resolution
		const dpi = Number(node.value) * dpiRatios[node.unit.toLowerCase()];
		const dpr = Math.floor(dpi / dpiRatios.x * 100) / 100;

		if (dpi in mediasByDpr) {
			return false;
		} else {
			const media = mediasByDpr[dpi] = postcss.atRule({
				name: 'media',
				params: `(-webkit-min-device-pixel-ratio: ${dpr}), (min-resolution: ${dpi}dpi)`
			});

			return media;
		}
	} else {
		return false;
	}
};
