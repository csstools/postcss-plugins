import path from 'path';

export function toPosix(x: string, referencePath: string): string | false {
	if (process.platform !== 'win32') {
		return x;
	}

	const fakePosixPath = path.resolve(x).split(path.sep).join(path.posix.sep);
	const firstReferencePathSegment = '/' + referencePath.split(path.posix.sep)[1] + '/';

	if (!fakePosixPath.includes(firstReferencePathSegment)) {
		return false;
	}

	return fakePosixPath.slice(fakePosixPath.indexOf(firstReferencePathSegment));
}
