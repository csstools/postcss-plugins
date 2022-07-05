import { promises as fsp } from 'fs';

// CI caches build outputs and also the current commit hash.
// The git log between this hash and the last commit represents what needs to be rebuild.
export async function lastCachedCommit() {
	try {
		return (await fsp.readFile('./.cached-commit')).trim();
	} catch(_) {
		return false;
	}
}
