// placeholder plugin
module.exports = {
	process: (css) => Promise.resolve({
		css: css,
		warnings: () => []
	})
};
