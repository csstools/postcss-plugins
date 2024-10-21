import fs from 'node:fs/promises';

export function move(from, to) {
	return {
		name: 'move',
		closeBundle: async function closeBundle() {
			await fs.rename(from, to);
		},
	};
}
