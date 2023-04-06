import { listModifiedFilesInPullRequest } from './list-modified-files.mjs';
import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';
import path from 'path';

const internalDependencies = [
	path.relative(process.cwd(), path.resolve('.github')),
	path.relative(process.cwd(), path.resolve('package-lock.json')),
	path.relative(process.cwd(), path.resolve('package.json')),
	path.relative(process.cwd(), path.resolve('rollup')),
	path.relative(process.cwd(), path.resolve('tsconfig.json')),
];

const knownNotRelevant = [
	path.relative(process.cwd(), path.resolve('e2e')),
	path.relative(process.cwd(), path.resolve('sites')),
];

export async function listModifiedWorkspaces() {
	if (process.env.BUILD_AND_TEST_ALL_PACKAGES) {
		// forcibly re-build and test everything.
		return {
			nothing: false,
			all: true,
			forced: true,
			modified: [],
		};
	}

	const workspaces = await listWorkspaces();

	const repository = process.env.GITHUB_REPOSITORY;
	const pullRequestNumber = process.env.GITHUB_ACTION_PULL_REQUEST_NUMBER;
	if (!repository || !pullRequestNumber) {
		return {
			nothing: false,
			all: true,
			modified: workspaces,
		};
	}

	const modifiedFiles = await listModifiedFilesInPullRequest(repository, pullRequestNumber);
	if (modifiedFiles.length === 0) {
		return {
			nothing: true,
			all: false,
			modified: [],
		};
	}

	const modifiedWorkspaces = new Set();

	MODIFIED_FILED_LOOP:
	for (const modifiedFile of modifiedFiles) {
		const modifiedFilePath = path.relative(process.cwd(), path.format(path.posix.parse(modifiedFile)));

		for (const notRelevant of knownNotRelevant) {
			if (modifiedFile.startsWith(notRelevant)) {
				continue MODIFIED_FILED_LOOP;
			}
		}

		for (const internalDependency of internalDependencies) {
			if (modifiedFile.startsWith(internalDependency)) {
				console.error('modified a private dependency', modifiedFile);
				// this file can influence anything
				// anything or everything might have changed
				return {
					nothing: false,
					all: true,
					modified: workspaces,
				};
			}
		}

		let isNonWorkspaceFile = true;
		for (const workspace of workspaces) {
			if (modifiedFilePath.startsWith(workspace.path)) {
				isNonWorkspaceFile = false;

				modifiedWorkspaces.add(workspace.name);
			}
		}

		if (isNonWorkspaceFile) {
			console.error('modifiedFile outside of workspaces', modifiedFile);
			// files outside of workspaces include "package-lock.json", rollup config, ...
			// anything or everything might have changed
			return {
				nothing: false,
				all: true,
				modified: workspaces,
			};
		}
	}

	for (const workspace of workspaces) {
		for (const dependency of workspace.dependencies) {
			if (modifiedWorkspaces.has(dependency)) {
				modifiedWorkspaces.add(workspace.name);
			}
		}
	}

	if (modifiedWorkspaces.size === 0) {
		return {
			nothing: true,
			all: false,
			modified: [],
		};
	}

	return {
		nothing: false,
		all: false,
		modified: workspaces.filter((workspace) => modifiedWorkspaces.has(workspace.name)),
	};
}
