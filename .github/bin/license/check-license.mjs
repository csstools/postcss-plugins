import path from 'path';
import { promises as fsp } from 'fs';
import { getFiles } from '../util/get-files.mjs';
import { parseLicenseField } from './parse-license-field.mjs';
import { licenseIsOkByException, osiApprovedWithCCO } from './allowed.mjs';

// Checks 2 things
// 1. Do all our dependencies have an appropriate license?
// 2. Are there unexpected license comments in build artifacts?
//
// Combined this should give our users sufficient safeguards against license issues.

const logEntries = [];

const allFiles = (await getFiles('./')).filter((file) => {
	// We do not distribute "e2e" contents
	if (file.includes(path.resolve('./e2e/'))) {
		return false;
	}

	// We do not distribute "sites" contents
	if (file.includes(path.resolve('./sites/'))) {
		return false;
	}

	// Test file
	if (file.endsWith('malformed_package_json/package.json')) {
		return false;
	}

	// Has a lot of nested contents which "inherit" license info from the parent directory
	if (file.includes('/test/resolver/')) {
		return false;
	}

	// No idea what "modules" is but it produces "package.json" files which aren't npm package descriptions and thus lack license info.
	if (file.endsWith('modules/package.json')) {
		return false;
	}

	return true;
});

// File contents
{
	const allDistFiles = allFiles.filter((file) => {
		if (file.endsWith('/package.json')) {
			return false;
		}

		return !file.includes('node_modules') && file.includes('/dist');
	});

	for (const file of allDistFiles) {
		const contents = await fsp.readFile(file, 'utf8');
		const lines = contents.split('\n');

		for (const line of lines) {
			if (line.includes('@license')) {
				if (line.startsWith(' * @license W3C')) {
					// W3C license is ok
					continue;
				}

				if (process.env.GITHUB_ACTIONS) {
					logEntries.push(`::error file=${path.relative(process.env.GITHUB_WORKSPACE, path.join(file.split('/dist/')[0], 'package.json'))},line=1,col=1::Found an unexpected @license comment in a build artifact.`);
				} else {
					logEntries.push(`Found an unexpected @license comment in a build artifact:\n\t${file}`);
				}
			}
		}
	}
}

// Package JSON contents
{
	const packageJsonFiles = allFiles.filter((file) => {
		return file.includes('/node_modules') && file.endsWith('/package.json');
	});

	const withLicense = new Map();
	const withoutLicense = new Set();

	// Read all "package.json" files and try to locate the license field
	for (const file of packageJsonFiles) {
		const data = await fsp.readFile(file, 'utf8');
		const packageJson = JSON.parse(data);

		if (!packageJson.license) {
			withoutLicense.add(file);
			continue;
		}

		withLicense.set(file, parseLicenseField(packageJson.license));

		parseLicenseField(packageJson.license).forEach((license) => {
			if (osiApprovedWithCCO.includes(license) || licenseIsOkByException(file, license)) {
				return;
			}

			if (process.env.GITHUB_ACTIONS) {
				logEntries.push(`::error file=${path.relative(process.env.GITHUB_WORKSPACE, path.resolve('./package.json'))},line=1,col=1::Found an invalid license (${license}) in a dependency (${file.split('/node_modules/').slice(1).join('/node_modules/')}).`);
			} else {
				logEntries.push(`Found an invalid license (${license}) in:\n\t${file}`);
			}
		});
	}

	// Maybe a parent directory has a license
	// It is common for packages to have subdirectories with other "package.json" files that don't have a license field.
	for (let file of withoutLicense.values()) {
		const ff = file;
		if (file.endsWith('/package.json')) {
			file = file.slice(0, -'/package.json'.length);
		}

		while (file && file !== '/') {
			file = path.dirname(file);

			if (withLicense.has(path.join(file, 'package.json'))) {
				withoutLicense.delete(ff);
				withLicense.set(ff, withLicense.get(path.join(file, 'package.json')));
			}
		}
	}

	for (let file of withoutLicense.values()) {
		if (process.env.GITHUB_ACTIONS) {
			logEntries.push(`::error file=${path.relative(process.env.GITHUB_WORKSPACE, path.resolve('./package.json'))},line=1,col=1::Missing license in a dependency (${file.split('/node_modules/').slice(1).join('/node_modules/')}).`);
		} else {
			logEntries.push(`Missing license in:\n\t${file}`);
		}
	}
}

if (logEntries.length > 0) {
	console.log(logEntries.join('\n'));
	process.exit(1);
}
