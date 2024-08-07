import { spawn } from 'node:child_process';
import { platform } from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function npmVersion(increment, packageDirectory) {
	{
		const packageInfo = JSON.parse(await fs.readFile(path.join(packageDirectory, 'package.json')));
		if (packageInfo.version === '0.0.0') {
			switch (increment) {
				case 'major':
					packageInfo.version = '1.0.0';
					break;
				case 'minor':
					packageInfo.version = '0.1.0';
					break;
				case 'patch':
					packageInfo.version = '0.0.1';
					break;

				default:
					throw new Error(`Unknown increment "${increment}"`);
			}

			await fs.writeFile(path.join(packageDirectory, 'package.json'), JSON.stringify(packageInfo, null, '\t') + '\n');
			return packageInfo.version;
		}
	}

	await new Promise((resolve, reject) => {
		const versionCmd = spawn(
			'npm',
			[
				'version',
				increment,
				'--no-workspaces-update',
			],
			{
				cwd: packageDirectory,
				shell: platform === 'win32',
			},
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
