import fs from 'fs/promises';
import path from 'path';

export async function currentVersion(packageDirectory) {
	return JSON.parse(await fs.readFile(path.join(packageDirectory, 'package.json'))).version;
}
