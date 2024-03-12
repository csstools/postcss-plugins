import type { AtRule, Declaration, Postcss } from 'postcss';
import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';

const dpiRatios: Map<string, number> = new Map([
	['dpcm', 2.54],
	['dpi', 1],
	['dppx', 96],
	['x', 96],
]);

// return a valid @media rule
export function getMedia(dpi: number | false, postcss: Postcss, decl: Declaration): AtRule|false {
	if (typeof dpi === 'boolean') {
		return false;
	}

	// calculate min-device-pixel-ratio and min-resolution
	const dpr = Math.floor(dpi / 96 * 100) / 100;

	const media = postcss.atRule({
		name: 'media',
		params: `(-webkit-min-device-pixel-ratio: ${dpr}), (min-resolution: ${dpi}dpi)`,
		source: decl.source,
	});

	return media;
}

export function getMediaDPI(node: Node): number|false {
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

	const ratio = dpiRatios.get(unitAndValue.unit.toLowerCase());
	if (ratio) {
		// calculate min-device-pixel-ratio and min-resolution
		return Number(unitAndValue.number) * ratio;
	} else {
		return false;
	}
}

function isNumericNode(node: valueParser.Node): boolean {
	if (!node || !node.value) {
		return false;
	}

	try {
		return valueParser.unit(node.value) !== false;
	} catch (_) {
		return false;
	}
}
