import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';
import fs from 'fs/promises'
import path from 'path'
import { version } from './version.mjs';
import { nowFormatted } from './date-format.mjs';
import { commit } from './commit.mjs';

const workspaces = await listWorkspaces();
const needsRelease = new Map();
const waitingOnDependencies = new Map();

const isDryRun = process.argv.slice(2).includes('--dry-run');

WORKSPACE_LOOP:
for (const workspace of workspaces) {
	if (workspace.private) {
		continue;
	}

	for (const dependency of workspace.dependencies) {
		if (needsRelease.has(dependency) || waitingOnDependencies.has(dependency)) {
			waitingOnDependencies.set(workspace.name, workspace);
			// Can not be released before all modified dependencies have been released.
			continue WORKSPACE_LOOP;
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
			console.warn("Invalid CHANGELOG.md in", workspace.name)
			continue WORKSPACE_LOOP;
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

console.log('Release plan:');
for (const workspace of needsRelease.values()) {
	console.log(`  - ${workspace.name} (${workspace.increment})`);
}

if (isDryRun) {
	process.exit(0);
}

for (const workspace of needsRelease.values()) {
	const newVersion = await version(workspace.increment, workspace.path);
	workspace.changelog = workspace.changelog.replace(`Unreleased (${workspace.increment})`, `${newVersion} (${nowFormatted()})`)
	await fs.writeFile(path.join(workspace.path, 'CHANGELOG.md'), workspace.changelog);
	await commit(newVersion, workspace.path, workspace.name);
}
