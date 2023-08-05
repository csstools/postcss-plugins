import { spawn } from 'child_process';
import { platform } from 'process';

export async function whoami(packageName) {
	return await new Promise((resolve, reject) => {
		const whoamiCmd = spawn(
			'npm',
			[
				'whoami'
			],
			{
				shell: platform === 'win32',
				stdio: 'pipe'
			}
		);

		let result = '';

		whoamiCmd.stdout.on('data', (data) => {
			result += data;
		});

		whoamiCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm whoami' exited with code ${code}`));
				return;
			}

			resolve(result.trim());
		});
	});
}
