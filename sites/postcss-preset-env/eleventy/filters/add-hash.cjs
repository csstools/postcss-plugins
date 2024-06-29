const path = require('path');
const { readFile } = require('fs/promises');
const crypto = require('crypto');

module.exports = function addHashFilter(absolutePath, callback) {
	const filePath = path.resolve(__dirname, `../../dist/${absolutePath}`);
	readFile(filePath, { encoding: 'utf-8' })
		.then(content => {
			const hash = crypto.createHash('sha512');
			hash.update(content, 'utf-8');
			return hash.digest('hex');
		})
		.then(hash => {
			callback(null, `${absolutePath}?hash=${hash.slice(0, 10)}`);
		})
		.catch(() => callback(null, absolutePath));
};
