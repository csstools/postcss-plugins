import fs from 'fs';
import { browserJavascript } from './presets/browser.javascript';
import { cliJavascript } from './presets/cli-javascript';
import { cliTypescript } from './presets/cli-typescript';
import { denoJavascript } from './presets/deno-javascript';
import { packageJavascript } from './presets/package-javascript';
import { packageTypescript } from './presets/package-typescript';

const packageInfo = JSON.parse(fs.readFileSync('./package.json'));

const isTypescript = (() => {
	if (packageInfo.types) {
		try {
			fs.statSync('./tsconfig.json').isFile();
			return true;
		} catch (_) {
			return false;
		}
	}
	return false;
})();

const hasDenoOutput = (() => {
	try {
		fs.statSync('./mod.js').isFile();
		return true;
	} catch (_) {
		return false;
	}
})();

const presets = [];

if (isTypescript) {
	if (packageInfo.main || packageInfo.module) {
		presets.push(...packageTypescript());
	}

	if (packageInfo.bin) {
		presets.push(...cliTypescript());
	}

	if (packageInfo.exports && ('./browser' in packageInfo.exports)) {
		// Browser script remain javascript as it's simpler to go old school JS in regular JS.
		presets.push(...browserJavascript());
	}
} else {
	if (packageInfo.main || packageInfo.module) {
		presets.push(...packageJavascript());
	}

	if (packageInfo.bin) {
		presets.push(...cliJavascript());
	}

	if (hasDenoOutput) {
		presets.push(...denoJavascript());
	}

	if (packageInfo.exports && ('./browser' in packageInfo.exports)) {
		presets.push(...browserJavascript());
	}
}

export default presets;
