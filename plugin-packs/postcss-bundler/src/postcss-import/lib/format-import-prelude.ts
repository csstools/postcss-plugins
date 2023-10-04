export function formatImportPrelude(layer: string | undefined, media: string | undefined, supports: string | undefined): string {
	const parts = [];

	if (typeof layer !== 'undefined') {
		let layerParams = 'layer';
		if (layer) {
			layerParams = 'layer(' + layer + ')';
		}

		parts.push(layerParams);
	}

	if (typeof supports !== 'undefined') {
		parts.push('supports(' + supports + ')');
	}

	if (typeof media !== 'undefined') {
		parts.push(media);
	}

	return parts.join(' ');
}
