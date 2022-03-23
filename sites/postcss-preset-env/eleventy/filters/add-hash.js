const path = require('path');
const { readFile } = require('fs/promises');
const hasha = require('hasha');

module.exports = function addHashFilter(absolutePath, callback) {
	const filePath = path.resolve(__dirname, `../../dist/${absolutePath}`);
	readFile(filePath, { encoding: 'utf-8' })
		.then(content => hasha.async(content))
		.then(hash => {
			callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
		})
		.catch(() => callback(null, absolutePath));
};
