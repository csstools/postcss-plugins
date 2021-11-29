export const packageBabelPreset = [
	['@babel/preset-env', {
		corejs: 3,
		loose: true,
		modules: false,
		targets: { node: 12 },
		useBuiltIns: 'usage',
	}],
];
