import fs from 'fs';

export function readFile(pathname) {
	return new Promise((resolve, reject) => {
		fs.readFile(pathname, 'utf8', (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

export function readJSON(pathname, ...keys) {
	return readFile(pathname).then(
		data => JSON.parse(data)
	).then(
		options => keys.length ?
			options[
				Object.keys(options).find(key => keys.includes(key))
			]
		: options
	).catch(
		() => ({})
	);
}

export function readOrWriteFile(pathname, data) {
	return readFile(pathname).catch(
		() => writeFile(pathname, data || '').then(
			() => ''
		)
	);
}

export function safelyReadFile(pathname) {
	return readFile(pathname).catch(
		() => ''
	);
}

export function writeFile(pathname, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(pathname, data, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}
