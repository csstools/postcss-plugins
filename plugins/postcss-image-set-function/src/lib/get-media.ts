import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';

const dpiRatios = { dpcm: 2.54, dpi: 1, dppx: 96, x: 96 };

// return a valid @media rule
export function getMedia(dpi: number | false, postcss, decl) {
	if (typeof dpi === 'boolean') {
		return false;
	}

	// calculate min-device-pixel-ratio and min-resolution
	const dpr = Math.floor(dpi / dpiRatios.x * 100) / 100;

	const media = postcss.atRule({
		name: 'media',
		params: `(-webkit-min-device-pixel-ratio: ${dpr}), (min-resolution: ${dpi}dpi)`,
		source: decl.source,
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

	if (!isNumericNode(node)) {
		return false;
	}

	const unitAndValue = valueParser.unit(node.value);
	if (!unitAndValue) {
		return false;
	}

	if (unitAndValue.unit.toLowerCase() in dpiRatios) {
		// calculate min-device-pixel-ratio and min-resolution
		return Number(unitAndValue.number) * dpiRatios[unitAndValue.unit.toLowerCase()];
	} else {
		return false;
	}
}

function isNumericNode(node): boolean {
	if (!node || !node.value) {
		return false;
	}

	try {
		return valueParser.unit(node.value) !== false;
	} catch (e) {
		return false;
	}
}
