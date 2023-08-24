const anyDataURLRegexp = /^data:text\/css(?:;(base64|plain))?,/i;
const base64DataURLRegexp = /^data:text\/css;base64,/i;
const plainDataURLRegexp = /^data:text\/css;plain,/i;

export function isValidDataURL(url?: string): boolean {
	return !!url && anyDataURLRegexp.test(url);
}

export function dataURLContents(url: string): string {
	if (base64DataURLRegexp.test(url)) {
		// "data:text/css;base64,".length === 21
		return Buffer.from(url.slice(21), 'base64').toString();
	}

	if (plainDataURLRegexp.test(url)) {
		// "data:text/css;plain,".length === 20
		return decodeURIComponent(url.slice(20));
	}

	// "data:text/css,".length === 14
	return decodeURIComponent(url.slice(14));
}
