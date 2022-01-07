const postcssImport = require('postcss-import');

const importWithProps = () => {
	return {
		postcssPlugin: 'postcss-custom-properties (with postcss-import)',
		plugins: [postcssImport(), require('../dist/index.cjs')()],
	};
};

importWithProps.postcss = true;

module.exports = importWithProps;
