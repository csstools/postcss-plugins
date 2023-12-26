import fs from 'fs/promises';

export async function fileContentsOrEmptyString(path: string): Promise<string> {
	try {
		return await fs.readFile(path, 'utf8');
	} catch (error) {
		return '';
	}
}
