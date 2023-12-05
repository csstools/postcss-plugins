import { spawn } from 'child_process';
import fs from 'fs/promises';

export function typescriptDeclarations() {
	return {
		name: 'typescript-declarations',
		renderStart: async function renderStart(outputOptions, inputOptions) {
			if (outputOptions.format !== 'es' || outputOptions.file !== 'dist/index.mjs') {
				return;
			}

			if (inputOptions.input.length !== 1 || inputOptions.input[0] !== 'src/index.ts') {
				return;
			}

			await fs.writeFile('api-extractor.json', `{
	"$schema": "https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json",
	"extends": "../../api-extractor.json",
	"mainEntryPointFilePath": "types/index.d.ts",
	"dtsRollup": {
		"untrimmedFilePath": "dist/index.d.ts"
	}
}
`);

			await tsc();
			await apiExtractor();
			await fs.rm('types', { recursive: true, force: true });
		},
	};
}

async function tsc() {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'npm',
			['exec', '--', 'tsc', '--emitDeclarationOnly', '--declarationDir', 'types'],
			{ stdio: 'inherit' },
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
			['exec', '--', 'api-extractor', 'run', '--local'],
			{ stdio: 'inherit' },
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
