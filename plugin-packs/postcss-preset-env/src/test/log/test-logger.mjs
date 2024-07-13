import { newLogger } from '../../log/helper.mjs';

export function newTestLogger() {
	let logs = [];
	const logger = newLogger();

	return {
		logger: logger,
		warn: (line) => {
			logs.push(line);
		},
		getLogs: () => {
			const x = logs.slice();
			logs = [];
			return x;
		},
	};
}

export function logsContainEnabledFor(logs, browsers) {
	const tests = browsers.map(browser => new RegExp(`^    ${browser} \\d+`));

	return tests.every(test => {
		return logs.some(log => test.test(log));
	});
}
