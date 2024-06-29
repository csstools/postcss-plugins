import { spawn } from 'child_process';

export async function commitSingleDirectory(commitMessage, dir) {
	await new Promise((resolve, reject) => {
		if (process.env.DEBUG) {
			resolve('not a real commit');

			return;
		}

		const commitCmd = spawn(
			'git',
			[
				'commit',
				'-am',
				commitMessage,
			],
			{
				cwd: dir,
			},
		);

		let stdoutBuffer = '';
		let stderrBuffer = '';

		commitCmd.stdout.on('data', (data) => {
			stdoutBuffer += data.toString();
		});

		commitCmd.stderr.on('data', (data) => {
			stderrBuffer += data.toString();
		});

		commitCmd.on('close', (code) => {
			if (0 !== code) {
				if (stderrBuffer) {
					reject(new Error(`'git commit -am' exited with code ${code} and error message: ${stderrBuffer}`));
					return;
				}

				reject(new Error(`'git commit -am' exited with code ${code}`));
				return;
			}

			resolve(stdoutBuffer);
		});
	});
}

export async function commitAfterDependencyUpdates() {
	await new Promise((resolve, reject) => {
		if (process.env.DEBUG) {
			resolve('not a real commit');

			return;
		}

		const commitCmd = spawn(
			'git',
			[
				'commit',
				'-am',
				'set dependencies to newly released versions',
			],
		);

		let stdoutBuffer = '';
		let stderrBuffer = '';

		commitCmd.stdout.on('data', (data) => {
			stdoutBuffer += data.toString();
		});

		commitCmd.stderr.on('data', (data) => {
			stderrBuffer += data.toString();
		});

		commitCmd.on('close', (code) => {
			if (0 !== code) {
				if (stderrBuffer) {
					reject(new Error(`'git commit -am' exited with code ${code} and error message: ${stderrBuffer}`));
					return;
				}

				reject(new Error(`'git commit -am' exited with code ${code}`));
				return;
			}

			resolve(stdoutBuffer);
		});
	});
}
