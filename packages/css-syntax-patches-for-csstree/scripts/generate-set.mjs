import { definitionSyntax } from 'css-tree-3.0.0';
import { sort_set } from './sort-set.mjs';

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
