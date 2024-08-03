import { spawn } from 'node:child_process';
import { platform } from 'node:process';

export async function updateDocumentation(packageDirectory, minimal = false) {
	await new Promise((resolve, reject) => {
		const docsCmd = spawn(
			'npm',
			[
				'run',
				'docs',
				'--if-present',
			],
			{
				env: {
					...process.env,
					MINIMAL: minimal ? 'true': undefined,
				},
				cwd: packageDirectory,
				shell: platform === 'win32',
			},
		);

		let stdoutBuffer = '';
		let stderrBuffer = '';

		docsCmd.stdout.on('data', (data) => {
			stdoutBuffer += data.toString();
		});

		docsCmd.stderr.on('data', (data) => {
			stderrBuffer += data.toString();
		});

		docsCmd.on('close', (code) => {
			if (0 !== code) {
				if (stderrBuffer) {
					reject(new Error(`'npm run docs' exited with code ${code} and error message: ${stderrBuffer}`));
					return;
				}

				reject(new Error(`'npm run docs' exited with code ${code}`));
				return;
			}

			resolve(stdoutBuffer);
		});
	});
}
