import { definitionSyntax } from 'css-tree-3';
import { sort_atrule_set, sort_set } from './sort-set.mjs';

export function generate_set(source) {
	const set = Object(null);

	for (const [name, definition] of Object.entries(source)) {
		if (!definition.syntax) {
			continue;
		}

		set[name] = {
			syntax: definitionSyntax.generate(definition.syntax),
		};
	}

	return sort_set(set);
}

export function generate_atrule_set(source) {
	const set = Object(null);

	for (const [name, definition] of Object.entries(source)) {
		if (!definition.descriptors) {
			continue;
		}

		set[name] = {
			descriptors: generate_set(definition.descriptors),
		};
	}

	return sort_atrule_set(set);
}
