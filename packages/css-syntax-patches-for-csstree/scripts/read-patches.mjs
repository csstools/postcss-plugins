import fs from 'node:fs/promises';
import path from 'node:path';

export async function read_patches() {
	return {
		webref_over_csstree: {
			atrules: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-atrules.json'))),
			properties: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-properties.json'))),
			types: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-types.json'))),
		},
	};
}
