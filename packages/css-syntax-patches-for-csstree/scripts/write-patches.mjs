import fs from 'node:fs/promises';
import path from 'node:path';
import { sort_atrule_set, sort_set } from './sort-set.mjs';

function format_from_definition_to_patch(definition, patch_definition) {
	if (
		definition.type === patch_definition.type &&
		definition['syntax-b'] === patch_definition['syntax-b'] &&
		definition['syntax-a'] === patch_definition['syntax-a']
	) {
		const patch = {
			...patch_definition,
		};

		if (definition.type === 'added' && !patch['syntax-m']) {
			patch['syntax-m'] = patch['syntax-a'];
		}

		return patch;
	}

	const patch = {
		...definition,
	};

	patch['syntax-m'] = definition.type === 'added' ? definition['syntax-a'] : false;
	patch['tests'] = {
		'passing': [],
		'failing': [],
	};
	patch['comment'] = '';

	return patch;
}

function format_definition(definition) {
	const patch = {
		...definition,
	};

	patch['syntax-m'] = definition.type === 'added' ? definition['syntax-a'] : false;
	patch['tests'] = {
		'passing': [],
		'failing': [],
	};
	patch['comment'] = '';

	return patch;
}

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

				if (patch_definition.descriptors) {
					merged_sets[set_name][kind_name][name] = {
						descriptors: Object(null),
					};

					for (const [descriptor_name, patch_descriptor] of Object.entries(patch_definition.descriptors)) {
						const descriptor = definition.descriptors[descriptor_name];
						if (!descriptor) {
							continue;
						}

						merged_sets[set_name][kind_name][name].descriptors[descriptor_name] = format_from_definition_to_patch(descriptor, patch_descriptor);
					}

					continue;
				}

				merged_sets[set_name][kind_name][name] = format_from_definition_to_patch(definition, patch_definition);
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
				if (definition.descriptors) {
					merged_sets[set_name][kind_name][name] ??= {
						descriptors: Object(null),
					};

					for (const [descriptor_name, descriptor] of Object.entries(definition.descriptors)) {
						const patch_descriptor = patch_kind[name]?.descriptors?.[descriptor_name];
						if (patch_descriptor) {
							continue;
						}

						merged_sets[set_name][kind_name][name].descriptors[descriptor_name] = format_definition(descriptor);
					}

					continue;
				}

				const patch_definition = patch_kind[name];
				if (patch_definition) {
					continue;
				}

				merged_sets[set_name][kind_name][name] = format_definition(definition);
			}
		}
	}

	for (const [set_name, merged_set] of Object.entries(merged_sets)) {
		for (const [kind_name, merged_kind] of Object.entries(merged_set)) {
			for (const [name, merged_definition] of Object.entries(merged_kind)) {
				if (merged_definition.descriptors) {
					for (const [descriptor_name, descriptor] of Object.entries(merged_definition.descriptors)) {
						merged_sets[set_name][kind_name][name].descriptors[descriptor_name] = sort_object_keys(descriptor);
					}
				} else {
					merged_sets[set_name][kind_name][name] = sort_object_keys(merged_definition);
				}
			}
		}
	}

	{
		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-atrules.json'),
			JSON.stringify(sort_atrule_set(merged_sets.webref_over_csstree.atrules), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-properties.json'),
			JSON.stringify(sort_set(merged_sets.webref_over_csstree.properties), null, '\t') + '\n',
			'utf-8',
		);

		await fs.writeFile(
			path.join('patches', 'webref-over-csstree-types.json'),
			JSON.stringify(sort_set(merged_sets.webref_over_csstree.types), null, '\t') + '\n',
			'utf-8',
		);
	}
}

function sort_object_keys(object) {
	const copy = Object(null);

	copy.type = object.type;
	copy.comment = object.comment;
	copy.omit = object.omit;
	copy['syntax-b'] = object['syntax-b'];
	copy['syntax-a'] = object['syntax-a'];
	copy['syntax-m'] = object['syntax-m'];
	copy.tests = {
		passing: object.tests?.passing ?? [],
		failing: object.tests?.failing ?? [],
	};

	return copy;
}
