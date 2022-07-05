import { lastCachedCommit } from "./last-cached-commit.mjs";
import { listModifiedFilesSince } from "./list-modified-files.mjs";
import { listWorkspaces } from "./list-workspaces.mjs";

export async function listModifiedWorkspaces() {
	const workspaces = await listWorkspaces();
	const since = await lastCachedCommit();
	if (!since) {
		// we have no previous commit to compare with
		// anything or everything might have changed
		return workspaces;
	}

	const modifiedFiles = listModifiedFilesSince(since);

	const modifiedWorkspaces = new Set();

	for (const modifiedFile of modifiedFiles) {
		let isNonWorkspaceFile = true;
		for (const workspace of workspaces) {
			if (modifiedFile.startsWith(workspace.path)) {
				isNonWorkspaceFile = false;

				modifiedWorkspaces.add(workspace);
			}
		}

		if (isNonWorkspaceFile) {
			// files outside of workspaces include "package-lock.json", rollup config, ...
			// anything or everything might have changed
			return workspaces;
		}
	}

	return Array.from(modifiedWorkspaces);
}

console.log(await listModifiedWorkspaces());
