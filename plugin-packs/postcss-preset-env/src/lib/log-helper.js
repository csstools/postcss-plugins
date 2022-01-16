const logs = [];

export function log(str) {
	logs.push(str);
}

export function dumpLogs(result) {
	if (result) {
		logs.forEach(line => result.warn(line));
	}

	logs.length = 0;
}
