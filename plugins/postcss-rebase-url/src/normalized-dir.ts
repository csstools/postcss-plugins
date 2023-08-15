import path from 'path';

export function normalizedDir(x: string): string {
	return path.parse(path.resolve(x.trim())).dir.split(path.sep).join(path.posix.sep);
}
