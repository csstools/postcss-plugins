import fs from 'node:fs/promises';
import path from 'node:path';
import { sort_set } from './sort-set.mjs';

export async function write_patches(sets, patch_sets) {
	const merged_sets = Object(null);

	for (const [set_name, patch_set] of Object.entries(patch_sets)) {
		const set = sets[set_name];
		merged_sets[set_name] = Object(null);

		for (const [kind_name, patch_kind] of Object.entries(patch_set)) {
			const kind = set[kind_name];
			merged_sets[set_name][kind_name] = Object(null);

			for (const [name, patch_definition] of Object.entries(patch_kind)) {
				const definition = kind[name];
				if (!definition) {
					continue;
				}

				if (
					definition.type === patch_definition.type &&
					definition['syntax-b'] === patch_definition['syntax-b'] &&
					definition['syntax-a'] === patch_definition['syntax-a']
				) {
					merged_sets[set_name][kind_name][name] = {
						...patch_definition,
					};

					continue;
				}

				merged_sets[set_name][kind_name][name] = {
					...definition,
				};

				merged_sets[set_name][kind_name][name]['syntax-m'] = false;
				merged_sets[set_name][kind_name][name]['tests'] = {
					'passing': [],
					'failing': [],
				};
				merged_sets[set_name][kind_name][name]['comment'] = '';
			}
		}
	}

	for (const [set_name, set] of Object.entries(sets)) {
		const patch_set = patch_sets[set_name];
		if (!patch_set) {
			merged_sets[set_name] = set;
			continue;
		}

		for (const [kind_name, kind] of Object.entries(set)) {
			const patch_kind = patch_set[kind_name];
			if (!patch_kind) {
				merged_sets[set_name][kind_name] = kind;
				continue;
			}

			for (const [name, definition] of Object.entries(kind)) {
				const patch_definition = patch_kind[name];
				if (patch_definition) {
					continue;
				}

				merged_sets[set_name][kind_name][name] = {
					...definition,
				};

				merged_sets[set_name][kind_name][name]['syntax-m'] = false;
				merged_sets[set_name][kind_name][name]['tests'] = {
					'passing': [],
					'failing': [],
				};
				merged_sets[set_name][kind_name][name]['comment'] = '';
			}
		}
	}

	for (const [set_name, merged_set] of Object.entries(merged_sets)) {
		for (const [kind_name, patch_kind] of Object.entries(merged_set)) {
			for (const [name, patch_definition] of Object.entries(patch_kind)) {
				merged_sets[set_name][kind_name][name] = sort_object_keys(patch_definition);
			}
		}
	}

	{
		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-properties.json'),
			JSON.stringify(sort_set(merged_sets.webref_over_csstree.properties), null, '\t'),
			'utf-8',
		);

		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-types.json'),
			JSON.stringify(sort_set(merged_sets.webref_over_csstree.types), null, '\t'),
			'utf-8',
		);
	}
}

function sort_object_keys(object) {
	const copy = Object(null);

	copy.type = object.type;
	copy.comment = object.comment;
	copy['syntax-b'] = object['syntax-b'];
	copy['syntax-a'] = object['syntax-a'];
	copy['syntax-m'] = object['syntax-m'];
	copy.tests = {
		passing: object.tests?.passing ?? [],
		failing: object.tests?.failing ?? [],
	};

	return copy;
}
