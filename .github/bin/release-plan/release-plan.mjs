import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';
import fs from 'fs/promises'
import path from 'path'

const workspaces = await listWorkspaces();
const needsRelease = new Map();
const waitingOnDependencies = new Map();

WORKSPACE_LOOP:
for (const workspace of workspaces) {
	if (workspace.private) {
		continue;
	}

	const changelog = (await fs.readFile(path.join(workspace.path, 'CHANGELOG.md'))).toString();
	for (const dependency of workspace.dependencies) {
		if (needsRelease.has(dependency) || waitingOnDependencies.has(dependency)) {
			waitingOnDependencies.set(workspace.name, workspace);
			// Can not be released before all modified dependencies have been released.
			continue WORKSPACE_LOOP;
		}
	}

	if (changelog.includes('Unreleased')) {
		if (changelog.includes('Unreleased (patch)')) {

		} else if (changelog.includes('Unreleased (minor)')) {

		} else if (changelog.includes('Unreleased (major)')) {

		} else {
			console.warn("Invalid CHANGELOG.md in", workspace.name)
			process.exit(1);
		}

		needsRelease.set(workspace.name, workspace);
		continue;
	}
}

console.log(Array.from(needsRelease.keys()));
