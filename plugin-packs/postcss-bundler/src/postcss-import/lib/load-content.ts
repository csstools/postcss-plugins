import fs from 'node:fs/promises';
import { dataURLContents, isValidDataURL } from './data-url';

export async function loadContent(filename: string): Promise<string> {
	if (isValidDataURL(filename)) {
		return dataURLContents(filename);
	}

	return fs.readFile(filename, 'utf-8');
}
