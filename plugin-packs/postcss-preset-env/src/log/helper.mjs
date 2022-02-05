class Logger {
	constructor() {
		this.logs = [];
	}

	log(str) {
		this.logs.push(str);
	}

	resetLogger() {
		this.logs.length = 0;
	}

	dumpLogs(result) {
		if (result) {
			this.logs.forEach(line => result.warn(line));
		}

		this.resetLogger();
	}
}

export function newLogger() {
	return new Logger();
}

