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
