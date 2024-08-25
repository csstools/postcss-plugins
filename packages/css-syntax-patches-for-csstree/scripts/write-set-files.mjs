import fs from 'node:fs/promises';
import path from 'node:path';

export async function write_set_files(sets) {
	{
		await fs.writeFile(
			path.join('raw-data', 'csstree-properties.json'),
			JSON.stringify(sets.csstree.properties, null, '\t'),
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'csstree-types.json'),
			JSON.stringify(sets.csstree.types, null, '\t'),
			'utf-8',
		);
	}

	{
		await fs.writeFile(
			path.join('raw-data', 'webref-properties.json'),
			JSON.stringify(sets.webref.properties, null, '\t'),
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-types.json'),
			JSON.stringify(sets.webref.types, null, '\t'),
			'utf-8',
		);
	}

	{
		await fs.writeFile(
			path.join('raw-data', 'webref-over-csstree-properties.json'),
			JSON.stringify(sets.webref_over_csstree.properties, null, '\t'),
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-over-csstree-types.json'),
			JSON.stringify(sets.webref_over_csstree.types, null, '\t'),
			'utf-8',
		);
	}
}
