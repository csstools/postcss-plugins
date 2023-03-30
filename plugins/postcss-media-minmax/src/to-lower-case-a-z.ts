const toLowerCaseAZRegex = /[A-Z]/g;
export function toLowerCaseAZ(x: string): string {
	return x.replace(toLowerCaseAZRegex, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
}
