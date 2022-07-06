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

		if (process.env.VERBOSE) {
			console.log(result);
			console.log(refCommit);
			console.log(result.stdout.split('\n').filter((x) => !!x));
		}

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
