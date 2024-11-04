import fs from 'node:fs/promises';
import path from 'node:path';

export async function write_final_file(data) {
	await fs.writeFile(
		path.join('dist', 'index.json'),
		JSON.stringify(data, null, '\t') + '\n',
		'utf-8',
	);
}
