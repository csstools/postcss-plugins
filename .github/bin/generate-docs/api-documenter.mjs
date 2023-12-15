import { spawn } from 'child_process';
import { platform } from 'process';
import path from 'path';
import fs from 'fs';

import { listWorkspaces } from "../list-workspaces/list-workspaces.mjs";

const workspaces = await listWorkspaces();

for (const workspace of workspaces) {
	await runApiDocumenter(workspace);
}

async function runApiDocumenter(workspace) {
	await new Promise((resolve, reject) => {
		if (workspace.private) {
			resolve(true);

			return;
		}

		const docsExist = fs.existsSync(path.join(workspace.path, 'docs', workspace.unscopedName + '.api.json'));
		if (!docsExist) {
			resolve(true);

			return;
		}

		const publishCmd = spawn(
			'npm',
			[
				'exec',
				'--',
				'api-documenter',
				'markdown',
				'--input-folder',
				path.join(workspace.path, 'docs'),
				'--output-folder',
				path.join(workspace.path, 'api-reference'),
			],
			{
				stdio: 'inherit',
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
