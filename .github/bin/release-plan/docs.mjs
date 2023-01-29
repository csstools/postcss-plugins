import { spawn } from 'child_process';

export async function updateDocumentation(packageDirectory) {
	await new Promise((resolve, reject) => {
		const docsCmd = spawn(
			'npm',
			[
				'run',
				'docs',
				'--if-present'
			],
			{
				cwd: packageDirectory
			}
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
