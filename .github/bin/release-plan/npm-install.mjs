import { spawn } from 'child_process';

export async function npmInstall() {
	await new Promise((resolve, reject) => {
		const publishCmd = spawn(
			'npm',
			[
				'install'
			],
		);

		publishCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm install' exited with code ${code}`));
				return;
			}

			resolve(true);
		});
	});
}
