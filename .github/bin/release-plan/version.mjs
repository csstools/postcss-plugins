import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export async function version(increment, packageDirectory) {
	await new Promise((resolve, reject) => {
		const versionCmd = spawn(
			'npm',
			[
				'version',
				increment
			],
			{
				cwd: packageDirectory
			}
		);

		let stdoutBuffer = '';
		let stderrBuffer = '';

		versionCmd.stdout.on('data', (data) => {
			stdoutBuffer += data.toString();
		});

		versionCmd.stderr.on('data', (data) => {
			stderrBuffer += data.toString();
		});

		versionCmd.on('close', (code) => {
			if (0 !== code) {
				if (stderrBuffer) {
					reject(new Error(`'npm version ${increment}' exited with code ${code} and error message: ${stderrBuffer}`));
					return;
				}

				reject(new Error(`'npm version ${increment}' exited with code ${code}`));
				return;
			}

			resolve(stdoutBuffer);
		});
	});

	const packageInfo = JSON.parse(await fs.readFile(path.join(packageDirectory, 'package.json')));
	return packageInfo.version;
}
