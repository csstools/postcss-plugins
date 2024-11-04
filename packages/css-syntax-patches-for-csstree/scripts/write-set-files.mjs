import fs from 'node:fs/promises';
import path from 'node:path';
import { sort_atrule_set, sort_set } from './sort-set.mjs';

export async function write_set_files(sets) {
	{
		await fs.writeFile(
			path.join('raw-data', 'csstree-atrules.json'),
			JSON.stringify(sort_atrule_set(sets.csstree.atrules), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'csstree-properties.json'),
			JSON.stringify(sort_set(sets.csstree.properties), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'csstree-types.json'),
			JSON.stringify(sort_set(sets.csstree.types), null, '\t') + '\n',
			'utf-8',
		);
	}

	{
		await fs.writeFile(
			path.join('raw-data', 'webref-atrules.json'),
			JSON.stringify(sort_atrule_set(sets.webref.atrules), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-properties.json'),
			JSON.stringify(sort_set(sets.webref.properties), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-types.json'),
			JSON.stringify(sort_set(sets.webref.types), null, '\t') + '\n',
			'utf-8',
		);
	}

	{
		await fs.writeFile(
			path.join('raw-data', 'webref-over-csstree-atrules.json'),
			JSON.stringify(sort_atrule_set(sets.webref_over_csstree.atrules), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-over-csstree-properties.json'),
			JSON.stringify(sort_set(sets.webref_over_csstree.properties), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('raw-data', 'webref-over-csstree-types.json'),
			JSON.stringify(sort_set(sets.webref_over_csstree.types), null, '\t') + '\n',
			'utf-8',
		);
	}
}
