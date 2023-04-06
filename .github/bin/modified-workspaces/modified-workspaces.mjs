import { listModifiedFilesInPullRequest } from './list-modified-files.mjs';
import { listWorkspaces } from '../list-workspaces/list-workspaces.mjs';

const internalDependencies = [
	'.github/',
	'package-lock.json',
	'package.json',
	'rollup/',
	'tsconfig.json',
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

	for (const modifiedFile of modifiedFiles) {
		if (modifiedFile.startsWith('e2e/')) {
			continue;
		}

		if (modifiedFile.startsWith('sites/')) {
			continue;
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
			if (modifiedFile.startsWith(workspace.path)) {
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

	return {
		nothing: false,
		all: false,
		modified: workspaces.filter((workspace) => modifiedWorkspaces.has(workspace.name)),
	};
}
