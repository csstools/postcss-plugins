import { promises as fsp, constants } from 'fs';

const packageJSONInfo = JSON.parse(await fsp.readFile('./package.json', 'utf8'));
const packageJSONInfoCopy = JSON.stringify(packageJSONInfo, null, 2);
const formatted = {};

// Main info
{
	formatted.name = packageJSONInfo.name;
	delete packageJSONInfo.name;

	formatted.description = packageJSONInfo.description;
	delete packageJSONInfo.description;

	formatted.version = packageJSONInfo.version;
	delete packageJSONInfo.version;

	formatted.author = packageJSONInfo.author;
	delete packageJSONInfo.author;

	formatted.contributors = packageJSONInfo.contributors;
	delete packageJSONInfo.contributors;

	if (formatted.contributors && formatted.contributors.length) {
		formatted.contributors.sort();
	}

	formatted.license = packageJSONInfo.license;
	delete packageJSONInfo.license;
}

// Status and runtime info
{
	formatted.private = packageJSONInfo.private;
	delete packageJSONInfo.private;

	formatted.engines = packageJSONInfo.engines;
	delete packageJSONInfo.engines;

	formatted.type = packageJSONInfo.type;
	delete packageJSONInfo.type;
}

// Exports and packaged
{
	formatted.main = packageJSONInfo.main;
	delete packageJSONInfo.main;

	formatted.module = packageJSONInfo.module;
	delete packageJSONInfo.module;

	formatted.bin = packageJSONInfo.bin;
	delete packageJSONInfo.bin;

	formatted.types = packageJSONInfo.types;
	delete packageJSONInfo.types;

	formatted.jsdelivr = packageJSONInfo.jsdelivr;
	delete packageJSONInfo.jsdelivr;

	formatted.unpkg = packageJSONInfo.unpkg;
	delete packageJSONInfo.unpkg;

	formatted.exports = packageJSONInfo.exports;
	delete packageJSONInfo.exports;

	formatted.files = packageJSONInfo.files;
	delete packageJSONInfo.files;

	if (formatted.files && formatted.files.length) {
		formatted.files.sort();
	}
}

// Dependencies
{
	if (Object.keys(packageJSONInfo.dependencies ?? {}).length) {
		let dependencyKeys = Object.keys(packageJSONInfo.dependencies);
		dependencyKeys.sort((a, b) => a.localeCompare(b));

		formatted.dependencies = {};
		for (let i = 0; i < dependencyKeys.length; i++) {
			formatted.dependencies[dependencyKeys[i]] = packageJSONInfo.dependencies[dependencyKeys[i]];
		}
		delete packageJSONInfo.dependencies;
	}

	if (Object.keys(packageJSONInfo.peerDependencies ?? {}).length) {
		let dependencyKeys = Object.keys(packageJSONInfo.peerDependencies);
		dependencyKeys.sort((a, b) => a.localeCompare(b));

		formatted.peerDependencies = {};
		for (let i = 0; i < dependencyKeys.length; i++) {
			formatted.peerDependencies[dependencyKeys[i]] = packageJSONInfo.peerDependencies[dependencyKeys[i]];
		}
		delete packageJSONInfo.peerDependencies;
	}

	if (Object.keys(packageJSONInfo.devDependencies ?? {}).length) {
		let dependencyKeys = Object.keys(packageJSONInfo.devDependencies);
		dependencyKeys.sort((a, b) => a.localeCompare(b));

		formatted.devDependencies = {};
		for (let i = 0; i < dependencyKeys.length; i++) {
			formatted.devDependencies[dependencyKeys[i]] = packageJSONInfo.devDependencies[dependencyKeys[i]];
		}
		delete packageJSONInfo.devDependencies;
	}
}

// Scripts
{
	if (Object.keys(packageJSONInfo.scripts ?? {}).length) {
		let scriptKeys = Object.keys(packageJSONInfo.scripts);
		scriptKeys.sort((a, b) => {
			let aa = a;
			let bb = b;

			if (aa === 'prepublishOnly') {
				aa = 'prepublish';
			}
			if (bb === 'prepublishOnly') {
				bb = 'prepublish';
			}

			if (aa.indexOf('pre') === 0) {
				aa = aa.slice(3) + '-a';
			} else if (aa.indexOf('post') === 0) {
				aa = aa.slice(4) + '-c';
			} else {
				aa = aa+ '-b';
			}

			if (bb.indexOf('pre') === 0) {
				bb = bb.slice(3) + '-a';
			} else if (bb.indexOf('post') === 0) {
				bb = bb.slice(4) + '-c';
			} else {
				bb = bb + '-b';
			}


			return aa.localeCompare(bb);
		});

		formatted.scripts = {};
		for (let i = 0; i < scriptKeys.length; i++) {
			formatted.scripts[scriptKeys[i]] = packageJSONInfo.scripts[scriptKeys[i]];
		}
		delete packageJSONInfo.scripts;

		try {
			await fsp.access('./stryker.conf.json', constants.R_OK | constants.W_OK);
		} catch (_) {
			delete formatted.scripts.stryker;
		}
	}
}

// Metadata
{
	formatted.homepage = packageJSONInfo.homepage;
	delete packageJSONInfo.homepage;

	formatted.repository = packageJSONInfo.repository;
	delete packageJSONInfo.repository;

	formatted.bugs = packageJSONInfo.bugs;
	delete packageJSONInfo.bugs;

	formatted.keywords = packageJSONInfo.keywords;
	delete packageJSONInfo.keywords;

	if (formatted.keywords && formatted.keywords.length) {
		formatted.keywords.sort();
	}

	if (Object.keys(packageJSONInfo.csstools ?? {}).length) {
		let csstoolsKeys = Object.keys(packageJSONInfo.csstools);
		csstoolsKeys.sort((a, b) => a.localeCompare(b));

		formatted.csstools = {};
		for (let i = 0; i < csstoolsKeys.length; i++) {
			formatted.csstools[csstoolsKeys[i]] = packageJSONInfo.csstools[csstoolsKeys[i]];
		}
		delete packageJSONInfo.csstools;
	}
}

// Config
{
	formatted.volta = packageJSONInfo.volta;
	delete packageJSONInfo.volta;
}

Object.assign(formatted, packageJSONInfo);

if (process.env.GITHUB_ACTIONS && JSON.stringify(formatted, null, 2) !== packageJSONInfoCopy) {
	console.error('package.json has an incorrect field order. Run "npm run lint" to resolve.')
	process.exit(1);
}

await fsp.writeFile('./package.json', JSON.stringify(formatted, null, 2) + '\n');
