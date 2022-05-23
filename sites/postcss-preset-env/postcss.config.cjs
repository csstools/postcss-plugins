module.exports = ctx => {
	const isProd = ctx.env === 'production';

	return {
		map: !isProd,
		plugins: {
			'postcss-import': {},
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
