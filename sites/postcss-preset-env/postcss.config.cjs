const crypto = require('crypto');
const cwd = process.cwd();

module.exports = ctx => {
	const isProd = ctx.env === 'production';

	return {
		map: !isProd,
		plugins: {
			'postcss-import': {
				nameLayer: hashLayerName,
			},
			'postcss-preset-env': {
				stage: 0,
				preserve: true,
				features: {
					'custom-properties': false,
					'custom-media-queries': {
						preserve: false,
					},
				},
			},
			'cssnano': isProd ? {
				preset: 'default',
			} : false,
		},
	};
};

function hashLayerName(index, rootFilename) {
	if (!rootFilename) {
		return `import-anon-layer-${index}`;
	}

	// A stable, deterministic and unique layer name:
	// - layer index
	// - relative rootFilename to current working directory
	return `import-anon-layer-${crypto
		.createHash('sha256')
		.update(`${index}-${rootFilename.split(cwd)[1]}`)
		.digest('hex')
		.slice(0, 12)}`;
}
