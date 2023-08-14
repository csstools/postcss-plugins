import fs from 'fs';
import { dataURLContents, isValidDataURL } from './data-url';

export function loadContent(filename: string): string|false {
	if (isValidDataURL(filename)) {
		return dataURLContents(filename);
	}

	return fs.readFileSync(filename, 'utf-8');
}
