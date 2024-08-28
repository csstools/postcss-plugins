import fs from 'node:fs/promises';
import path from 'node:path';

export async function write_patches(sets) {
	{
		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-properties.json'),
			JSON.stringify(sets.webref_over_csstree.properties, null, '\t'),
			'utf-8',
		);

		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-types.json'),
			JSON.stringify(sets.webref_over_csstree.types, null, '\t'),
			'utf-8',
		);
	}
}
