export default () => ({
	map: false,
	plugins: {
		'@csstools/postcss-global-data': {
			files: [
				'./media-queries.css',
			],
		},
		'@csstools/postcss-design-tokens': {},
		'postcss-custom-media': {},
	},
});
