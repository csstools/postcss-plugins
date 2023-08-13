import { spawn } from 'child_process';
import { platform } from 'process';

export async function canPublish(packageName, myName) {
	return new Promise((resolve, reject) => {
		const accessListCmd = spawn(
			'npm',
			[
				'access',
				'list',
				'collaborators',
				packageName,
				myName
			],
			{
				shell: platform === 'win32',
				stdio: 'pipe'
			}
		);

		let result = '';

		accessListCmd.stdout.on('data', (data) => {
			result += data;
		});

		accessListCmd.on('close', (code) => {
			if (0 !== code) {
				reject(new Error(`'npm ${['access', 'list', 'collaborators', packageName, myName].join(' ')}' exited with code ${code}`));
				return;
			}

			resolve(
				result.trim().includes(myName) &&
				result.trim().includes('read-write')
			);
		});
	});
}
