import { definitionSyntax } from 'css-tree';

export function generate_set(source) {
	const slice = [];

	for (const [name, definition] of Object.entries(source)) {
		if (!definition.syntax) {
			continue;
		}

		slice.push({
			property: name.replace(/^-(?:o|moz|ms|webkit|legacy|non-standard)-/i, ''),
			'vendor-prefix': (name.match(/^-(o|moz|ms|webkit|legacy|non-standard)-/i) ?? [])[1] ?? '',
			'prefixed-property': name,
			syntax: definitionSyntax.generate(definition.syntax),
		});
	}

	slice.sort((a, b) => {
		if (a.property === b.property) {
			return a['vendor-prefix'].localeCompare(b['vendor-prefix']);
		}

		return a.property.localeCompare(b.property);
	});

	const set = Object(null);
	slice.forEach((x) => {
		set[x['prefixed-property']] = {
			syntax: x.syntax,
		};
	});

	return set;
}
