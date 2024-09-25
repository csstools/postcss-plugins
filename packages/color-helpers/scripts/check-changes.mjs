import crypto from 'node:crypto';
import path from 'node:path';
import { URL } from 'node:url';
import fs from 'node:fs/promises';

const __dirname = new URL('.', import.meta.url).pathname;
const hashesPath = path.resolve(__dirname, './hashes.json');
const hashesFile = await fs.readFile(hashesPath, 'utf8').then(JSON.parse);
const isRewriting = process.env.REWRITE_HASHES;

const WATCHED_FILES = [
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/utilities.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/conversions.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/deltaEOK.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/multiply-matrices.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/hslToRgb.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/better-rgbToHsl.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/hwbToRgb.js',
	'https://raw.githubusercontent.com/w3c/csswg-drafts/main/css-color-4/rgbToHwb.js',
];

const newHashes = await Promise.all(WATCHED_FILES.map(async urlPath => {
	const content = await fetch(urlPath).then(response => response.text());
	const hash = crypto.createHash('md5');
	hash.update(content, 'utf8');
	return hash.digest('hex');
}));

const changes = newHashes
	.map((hash, index) => [hash, WATCHED_FILES[index]])
	.filter(([hash], index) => hashesFile[index] !== hash)
	.map(([,file]) => file);

if (changes.length) {
	// eslint-disable-next-line no-console
	console.log('Changes have been detected in the following files:');
	// eslint-disable-next-line no-console
	changes.forEach(change => console.log('└ %s', change));

	if (isRewriting) {
		await fs.writeFile(hashesPath, JSON.stringify(newHashes, null, '\t'));
		// eslint-disable-next-line no-console
		console.log('Changes have been updated.');
		process.exit(0);
	} else {
		process.exit(1);
	}
}

// eslint-disable-next-line no-console
console.log('No changes detected');
