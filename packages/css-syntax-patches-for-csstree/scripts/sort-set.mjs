export function sort_set(source) {
	const slice = [];

	for (const [name, definition] of Object.entries(source)) {
		slice.push({
			property: name.replace(/^-(?:o|moz|ms|webkit|legacy|non-standard)-/i, ''),
			'vendor-prefix': (name.match(/^-(o|moz|ms|webkit|legacy|non-standard)-/i) ?? [])[1] ?? '',
			'prefixed-property': name,
			definition: definition,
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
			...x.definition,
		};
	});

	return set;
}
