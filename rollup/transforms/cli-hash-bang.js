export function addHashBang () {
	return {
		name: 'add-hash-bang',
		renderChunk (code) {
			const updatedCode = `#!/usr/bin/env node\n\n${code}`;

			return updatedCode;
		},
	};
}
