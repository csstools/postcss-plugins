import { exec } from './exec.mjs';

export async function listModifiedFilesSince(refCommit) {
	try {
		const args = [
			'--no-pager',
			'diff',
			'--name-only',
			refCommit,
		];

		if (!process.env.GITHUB_ACTIONS) {
			args.push('HEAD');
		}

		const result = await exec(
			'git',
			args,
		);

		const list = result.stdout.split('\n').filter((x) => !!x);
		if (!list.length && result.stderr) {
			throw new Error(`empty list of modified files with message "${result.stderr}"`);
		}

		return list;
	} catch(err) {
		console.error(err);
		throw new Error('failed to get the list of modified files');
	}
}
