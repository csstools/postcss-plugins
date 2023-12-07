import fs from 'fs/promises';
import path from 'path';
import { platform } from 'process';
import { spawn } from 'child_process';

export function typescriptDeclarations() {
	const jobs = [];

	return {
		name: 'typescript-declarations',
		renderStart: async function renderStart(outputOptions, inputOptions) {
			if (outputOptions.format !== 'es' || outputOptions.file !== 'dist/index.mjs') {
				return;
			}

			if (inputOptions.input.length !== 1 || inputOptions.input[0] !== 'src/index.ts') {
				return;
			}

			const runningJob = (async () => {
				await tsc();
				await apiExtractor();
				await fs.rm(path.join('dist', '_types'), { recursive: true, force: true });
			})();

			jobs.push(runningJob);
		},
		writeBundle: async function writeBundle() {
			await Promise.all(jobs);
		},
	};
}

async function tsc() {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'npm',
			['exec', '--', 'tsc', '--emitDeclarationOnly', '--declarationDir', path.join('dist', '_types')],
			{
				stdio: 'inherit',
				shell: platform === 'win32',
			},
		);
		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`tsc failed with code ${code}`));
			}
		});
	});
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
