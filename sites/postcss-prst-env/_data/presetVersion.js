const presetEnv = require('../../../plugin-packs/postcss-preset-env/package.json');

module.exports = async function presetVersion() {
	return presetEnv.version;
};
