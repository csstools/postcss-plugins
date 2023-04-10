const sitesPackageLock = require('../../package-lock.json');

module.exports = async function presetVersionPlayground() {
	return sitesPackageLock.packages['node_modules/postcss-preset-env'].version;
};
