export function nodeCoverageDisable () {
	return {
		name: 'node-coverage-disable',
		renderChunk (code) {
			return `/* node:coverage disable */\n${code}\n/* node:coverage enable */\n`;
		},
	};
}
