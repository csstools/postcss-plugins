const logs = [];

export function log(str) {
	logs.push(str);
}

export function resetLogger() {
	logs.length = 0;
}

export function dumpLogs(result) {
	if (result) {
		logs.forEach(line => result.warn(line));
	}

	resetLogger();
}
