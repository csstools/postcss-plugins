import fs from 'node:fs/promises';
import path from 'node:path';

export async function currentVersion(packageDirectory) {
	return JSON.parse(await fs.readFile(path.join(packageDirectory, 'package.json'))).version;
}
