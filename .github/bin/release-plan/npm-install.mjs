import { spawn } from 'child_process';
import { platform } from 'process';

export async function npmInstall() {
	await new Promise((resolve, reject) => {
		const installCmd = spawn(
			'npm',
			[
				'install',
			],
			{
				shell: platform === 'win32',
			},
		);

		installCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm install' exited with code ${code}`));
				return;
			}

			resolve(true);
		});
	});
}
