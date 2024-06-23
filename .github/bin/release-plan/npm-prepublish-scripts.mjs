import { spawn } from 'child_process';
import { platform } from 'process';

export async function npmPrepublishScripts(packageDirectory, packageName) {
	await new Promise((resolve, reject) => {
		if (process.env.DEBUG) {
			resolve(true);

			return;
		}

		const publishCmd = spawn(
			'npm',
			[
				'run',
				'prepublishOnly',
				'--if-present',
			],
			{
				stdio: 'inherit',
				cwd: packageDirectory,
				shell: platform === 'win32',
			},
		);

		publishCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm run prepublishOnly' exited with code ${code} for ${packageName}`));
				return;
			}

			resolve(true);
		});
	});
}
