import { spawn } from 'child_process';
import { platform } from 'process';

export async function npmPublish(packageDirectory, packageName) {
	await new Promise((resolve, reject) => {
		if (process.env.DEBUG) {
			resolve(true);

			return;
		}

		const publishCmd = spawn(
			'npm',
			[
				'publish',
				'--access',
				'public'
			],
			{
				stdio: 'inherit',
				cwd: packageDirectory,
				shell: platform === 'win32'
			}
		);

		publishCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm publish' exited with code ${code} for ${packageName}`));
				return;
			}

			resolve(true);
		});
	});
}
