import crypto from 'crypto';

export function hashLayerName(index: number, rootFilename: string) {
	if (!rootFilename) {
		return `import-anon-layer-${index}`;
	}

	// A stable, deterministic and unique layer name:
	// - layer index
	// - relative rootFilename to current working directory
	return `import-anon-layer-${crypto
		.createHash('sha256')
		.update(`${index}-${rootFilename}`)
		.digest('hex')
		.slice(0, 12)}`;
}
