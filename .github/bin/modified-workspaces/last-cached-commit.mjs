import { promises as fsp } from 'fs';

// CI caches build outputs and also the current commit hash.
// The git log between this hash and the last commit represents what needs to be rebuild.
export async function lastCachedCommit() {
	if (process.env.GITHUB_REF === 'main') {
		// Always test everything on main.
		return false;
	}

	if (!process.env['commit-sha']) {
		return false;
	}

	console.log(`commit sha : "${process.env['commit-sha'].trim()}"`);

	return process.env['commit-sha'].trim();
}
