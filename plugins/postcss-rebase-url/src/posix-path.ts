import path from 'path';

export function toPosixPath(x: string): string {
	return x.split(path.sep).join(path.posix.sep);
}
