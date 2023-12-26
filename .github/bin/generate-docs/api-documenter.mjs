import { spawn } from 'child_process';
import { platform } from 'process';
import path from 'path';
import fs from 'fs';
import { getFiles } from '../util/get-files.mjs';

const packageJSONInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
if (packageJSONInfo.private) {
	process.exit(0);
}

const unscopedName = packageJSONInfo.name.replace(/^@[^/]+\//, '');

const docsExist = fs.existsSync(path.join('docs', unscopedName + '.api.json'));
if (!docsExist) {
	process.exit(0);
}

const docsContents = fs.readFileSync(path.join('docs', unscopedName + '.api.json'), 'utf8');

await new Promise((resolve, reject) => {
	const publishCmd = spawn(
		'npm',
		[
			'exec',
			'--',
			'api-documenter',
			'markdown',
			'--input-folder',
			'docs',
			'--output-folder',
			'docs',
		],
		{
			stdio: 'inherit',
			shell: platform === 'win32'
		}
	);

	publishCmd.on('close', (code) => {
		if (0 !== code) {
			reject(new Error(`'api-documenter' exited with code ${code}`));
		}

		fs.writeFileSync(path.join('docs', unscopedName + '.api.json'), docsContents);
		resolve();
	});
});

for (const file of await getFiles('docs', true)) {
	const fileContents = fs.readFileSync(file, 'utf8').toString();
	const cleanFileContents = fileContents.replace(/\r\n/g, "\n");
	fs.writeFileSync(file, cleanFileContents);
}
