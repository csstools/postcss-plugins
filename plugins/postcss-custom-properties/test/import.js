const postcssImport = require('postcss-import');

const importWithProps = () => {
	return {
		postcssPlugin: 'import-with-props',
		plugins: [postcssImport(), require('../dist/index.cjs')()],
	};
};

importWithProps.postcss = true;

module.exports = importWithProps;
