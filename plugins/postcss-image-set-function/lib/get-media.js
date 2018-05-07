import postcss from 'postcss';

const dpiRatios = { dpcm: 2.54, dpi: 1, dppx: 96, x: 96 };

// return a valid @media rule
export default (node, mediasByDpi) => {
	if (Object(node).type === 'number' && node.unit in dpiRatios) {
		// calculate min-device-pixel-ratio and min-resolution
		const dpi = Number(node.value) * dpiRatios[node.unit.toLowerCase()];
		const pxRatio = Math.floor(dpi / dpiRatios.x * 100) / 100;

		if (dpi in mediasByDpi) {
			return false;
		} else {
			const media = mediasByDpi[dpi] = postcss.atRule({
				name: 'media',
				params: `(-webkit-min-device-pixel-ratio: ${pxRatio}), (min-resolution: ${dpi}dpi)`
			});

			return media;
		}
	} else {
		return false;
	}
};
