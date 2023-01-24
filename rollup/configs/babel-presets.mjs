export const packageBabelPreset = [
	['@babel/preset-env', {
		loose: true,
		modules: false,
		targets: { node: 14 },
		useBuiltIns: false,
	}],
];
