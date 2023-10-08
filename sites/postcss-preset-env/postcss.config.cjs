module.exports = ctx => {
	const isProd = ctx.env === 'production';

	return {
		map: !isProd,
		plugins: {
			'@csstools/postcss-bundler': {},
			'postcss-preset-env': {
				stage: 0,
				features: {
					'custom-properties': false,
				},
			},
			'@csstools/postcss-minify': isProd ? {} : false,
		},
	};
};
