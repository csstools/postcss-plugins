import fs from 'fs/promises';
import path from 'path';
import { platform } from 'process';
import { spawn } from 'child_process';

export function typescriptDeclarations() {
	return {
		name: 'typescript-declarations',
		closeBundle: async function closeBundle() {
			await apiExtractor();
			await fs.rm(path.join('dist', '_types'), { recursive: true, force: true });
		},
	};
}

async function apiExtractor() {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'npm',
			['exec', '--', 'api-extractor', 'run'],
			{
				stdio: [
					'ignore',
					'ignore', // use 'inherit' to debug
					'inherit',
				],
				shell: platform === 'win32',
			},
		);
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`api-extractor failed with code ${code}`));
			}
		});
	});
}
