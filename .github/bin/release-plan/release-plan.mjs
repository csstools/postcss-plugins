import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';
import fs from 'fs/promises'
import path from 'path'
import { npmVersion } from './npm-version.mjs';
import { nowFormatted } from './date-format.mjs';
import { commitAfterPackageRelease } from './commit.mjs';
import { npmPublish } from './npm-publish.mjs';
import { updateDocumentation } from './docs.mjs';
import { npmInstall } from './npm-install.mjs';
import { discordAnnounce } from './discord-announce.mjs';

const workspaces = await listWorkspaces();
// Things to release
const needsRelease = new Map();
// Things that should be released after this plan
const maybeNextPlan = new Map();
// Things not to release
const notReleasableNow = new Map();
// Downstream dependents
let didChangeDownstreamPackages = false;

const isDryRun = process.argv.slice(2).includes('--dry-run');

WORKSPACES_LOOP:
for (const workspace of workspaces) {
	if (workspace.private) {
		continue;
	}

	for (const dependency of workspace.dependencies) {
		if (needsRelease.has(dependency) || notReleasableNow.has(dependency)) {
			notReleasableNow.set(workspace.name, workspace);

			let changelog = (await fs.readFile(path.join(workspace.path, 'CHANGELOG.md'))).toString();
			if (changelog.includes('Unreleased')) {
				maybeNextPlan.set(workspace.name, workspace);
			}
			// Can not be released before all modified dependencies have been released.
			continue WORKSPACES_LOOP;
		}
	}

	let changelog = (await fs.readFile(path.join(workspace.path, 'CHANGELOG.md'))).toString();
	if (changelog.includes('Unreleased')) {
		let increment = '';
		if (changelog.includes('Unreleased (patch)')) {
			increment = 'patch';
		} else if (changelog.includes('Unreleased (minor)')) {
			increment = 'minor';
		} else if (changelog.includes('Unreleased (major)')) {
			increment = 'major';
		} else {
			console.warn("Invalid CHANGELOG.md in", workspace.name);
			notReleasableNow.set(workspace.name, workspace);
			continue WORKSPACES_LOOP;
		}

		workspace.increment = increment;
		workspace.changelog = changelog;
		needsRelease.set(workspace.name, workspace);
	}
}

if (needsRelease.size === 0) {
	console.log('Nothing to release');
	process.exit(0);
}

console.log('Excluded:');
for (const workspace of maybeNextPlan.values()) {
	console.log(`  - ${workspace.name}`);
}
console.log(''); // empty line

console.log('Release plan:');
for (const workspace of needsRelease.values()) {
	console.log(`  - ${workspace.name} (${workspace.increment})`);
}
console.log(''); // empty line

if (isDryRun) {
	process.exit(0);
}

for (const workspace of needsRelease.values()) {
	console.log(`Releasing : ${workspace.name}`);
	// Increment the version
	workspace.newVersion = await npmVersion(workspace.increment, workspace.path);

	// Update the changelog
	const changelog = workspace.changelog.replace(`Unreleased (${workspace.increment})`, `${workspace.newVersion} (${nowFormatted()})`);
	await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), changelog);

	// Update the documentation
	await updateDocumentation(workspace.path);

	// Publish to npm
	await npmPublish(workspace.path, workspace.name);

	// Announce on discord
	await discordAnnounce(workspace);

	// Commit changes
	await commitAfterPackageRelease(workspace.newVersion, workspace.path, workspace.name);
}

console.log('\nPreparing next plan');

for (const workspace of notReleasableNow.values()) {
	const packageInfo = JSON.parse(await fs.readFile(path.join(workspace.path, 'package.json')));
	let didChange = false;

	for (const dependency of workspace.dependencies) {
		if (needsRelease.has(dependency)) {
			const updated = needsRelease.get(dependency);

			if (
				packageInfo.dependencies &&
				packageInfo.dependencies[updated.name] &&
				packageInfo.dependencies[updated.name] !== '*' &&
				updated.newVersion
			) {
				packageInfo.dependencies[updated.name] = '^' + updated.newVersion;
				didChange = true;
			}
			if (
				packageInfo.devDependencies &&
				packageInfo.devDependencies[updated.name] &&
				packageInfo.devDependencies[updated.name] !== '*' &&
				updated.newVersion
			) {
				packageInfo.devDependencies[updated.name] = '^' + updated.newVersion;
				didChange = true;
			}
			if (
				packageInfo.peerDependencies &&
				packageInfo.peerDependencies[updated.name] &&
				packageInfo.peerDependencies[updated.name] !== '*' &&
				updated.newVersion
			) {
				packageInfo.peerDependencies[updated.name] = '^' + updated.newVersion;
				didChange = true;
			}
		}
	}

	if (didChange) {
		didChangeDownstreamPackages = true;
		await fs.writeFile(path.join(workspace.path, 'package.json'), JSON.stringify(packageInfo, null, '\t') + '\n');
	}
}

console.log('\nUpdating lock file');
await npmInstall();

console.log('\nDone 🎉');

if (didChangeDownstreamPackages || maybeNextPlan.size > 0) {
	console.log('\nNotes:'); // empty line
	if (didChangeDownstreamPackages) {
		console.log('  - updated "package.json" files of downstream packages.');
	}
	if (maybeNextPlan.size) {
		console.log('  - some packages where excluded from this plan. A next plan of releases might be available now.');
	}
}
