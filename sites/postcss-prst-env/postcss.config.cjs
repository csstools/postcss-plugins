module.exports = ctx => {
	const isProd = ctx.env === 'production';
	const plugins = {
		'postcss-import': {},
		'postcss-preset-env': {
			stage: 0,
		},
		'postcss-csso': isProd ? {} : false,
	}

	return {
		map: !isProd,
		plugins,
	};
};
