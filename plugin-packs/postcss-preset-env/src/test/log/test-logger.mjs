export function testLogger() {
	let logs = [];

	return {
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
