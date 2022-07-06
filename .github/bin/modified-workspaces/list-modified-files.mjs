import { exec } from './exec.mjs';

export async function listModifiedFilesSince(refCommit) {
	try {
		const result = await exec(
			'git',
			[
				'--no-pager',
				'diff',
				'--name-only',
				refCommit,
				'HEAD',
			],
		);

		const list = result.stdout.split(/[\r\n]+/).map((x) => x.trim()).filter((x) => !!x);
		if (!list.length && result.stderr) {
			throw new Error(`empty list of modified files with message "${result.stderr}"`);
		}

		return list;
	} catch(err) {
		console.error(err);
		throw new Error('failed to get the list of modified files');
	}
}
