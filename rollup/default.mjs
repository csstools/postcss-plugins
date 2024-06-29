import fs from 'fs';
import { browserJavascript } from './presets/browser-javascript.mjs';
import { cliTypescript } from './presets/cli-typescript.mjs';
import { packageJavascript } from './presets/package-javascript.mjs';
import { packageTypescript } from './presets/package-typescript.mjs';

// Always clean the dist folder before building.
fs.rmSync('./dist', { recursive: true, force: true }); fs.mkdirSync('./dist');

const packageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

const isTypescript = (() => {
	try {
		return fs.statSync('./tsconfig.json').isFile() && fs.statSync('./src/index.ts').isFile();
	} catch {
		return false;
	}
})();

let nodeCoverageDisable = false;
if (packageInfo.name === '@csstools/postcss-tape') {
	nodeCoverageDisable = true;
}

const presets = [];

if (isTypescript) {
	if (packageInfo.main || packageInfo.module) {
		presets.push(...packageTypescript({nodeCoverageDisable: nodeCoverageDisable}));
	}

	if (packageInfo.exports && ('./browser' in packageInfo.exports)) {
		// Browser script remain javascript as it's simpler to go old school JS in regular JS.
		presets.push(...browserJavascript());
	}
} else {
	if (packageInfo.main || packageInfo.module) {
		presets.push(...packageJavascript());
	}

	if (packageInfo.exports && ('./browser' in packageInfo.exports)) {
		presets.push(...browserJavascript());
	}
}

if (packageInfo.bin) {
	presets.push(...cliTypescript());
}

export default presets;
