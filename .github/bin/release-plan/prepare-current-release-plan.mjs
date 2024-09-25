import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { currentVersion } from './current-version.mjs';
import { canPublish } from './npm-can-publish.mjs';
import { whoami } from './npm-whoami.mjs';

export async function prepareCurrentReleasePlan() {
	const iam = await whoami();
	if (!iam) {
		throw new Error('Could not determine current npm user');
	}

	const workspaces = await listWorkspaces();
	// Things to release
	const needsRelease = new Map();
	// Things that should be released after this plan
	const maybeNextPlan = new Map();
	// Things not to release
	const notReleasableNow = new Map();

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
				// eslint-disable-next-line no-console
				console.warn('Invalid CHANGELOG.md in', workspace.name);
				notReleasableNow.set(workspace.name, workspace);
				continue WORKSPACES_LOOP;
			}

			if (!(await canPublish(workspace.name, iam))) {
				if (increment !== 'patch') {
					// Patch releases that we can not publish are safe to skip.
					// Only new features and breaking changes are important down stream.
					notReleasableNow.set(workspace.name, workspace);
				}

				// eslint-disable-next-line no-console
				console.warn('Current npm user does not have write access for', workspace.name);
				continue WORKSPACES_LOOP;
			}

			workspace.increment = increment;
			workspace.changelog = changelog;
			needsRelease.set(workspace.name, workspace);
		}
	}

	// Only do a single initial publish at a time
	for (const [workspaceName, workspace] of needsRelease) {
		const version = await currentVersion(workspace.path);

		if (version === '0.0.0') {
			const allWorkspaces = new Map(needsRelease);
			allWorkspaces.delete(workspaceName);

			needsRelease.clear();
			needsRelease.set(workspaceName, workspace);

			for (const [workspaceName, workspace] of allWorkspaces) {
				maybeNextPlan.set(workspaceName, workspace);
				notReleasableNow.set(workspaceName, workspace);
			}

			break;
		}
	}

	if (needsRelease.size === 0) {
		// eslint-disable-next-line no-console
		console.log('Nothing to release');
		process.exit(0);
	}

	if (maybeNextPlan.size) {
		// eslint-disable-next-line no-console
		console.log('Excluded:');
		for (const workspace of maybeNextPlan.values()) {
			// eslint-disable-next-line no-console
			console.log(`  - ${workspace.name}`);
		}
		// eslint-disable-next-line no-console
		console.log(''); // empty line
	}

	if (needsRelease.size) {
		// eslint-disable-next-line no-console
		console.log('Release plan:');
		for (const workspace of needsRelease.values()) {
			// eslint-disable-next-line no-console
			console.log(`  - ${workspace.name} (${workspace.increment})`);
		}
		// eslint-disable-next-line no-console
		console.log(''); // empty line
	}

	return {
		needsRelease,
		maybeNextPlan,
		notReleasableNow,
	};
}
