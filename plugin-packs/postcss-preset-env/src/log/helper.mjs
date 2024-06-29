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

	emitLogs(result) {
		if (result) {
			result.warn(this.logs.join('\n'));
		}

		this.resetLogger();
	}
}

export function newLogger() {
	return new Logger();
}

