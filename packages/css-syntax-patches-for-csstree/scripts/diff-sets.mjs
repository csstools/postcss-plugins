export function diff_sets(a, b) {
	const diff = Object(null);

	for (const [name, definition] of Object.entries(a)) {
		if (!b[name]) {
			// Note: Currently impossible for items to be removed because we fork the existing syntax and add to it.
			diff[name] = {
				type: 'deleted',
				'syntax-b': definition.syntax,
				'syntax-a': '',
				'comment': '',
			};

			continue;
		}
	}

	for (const [name, definition] of Object.entries(b)) {
		if (!a[name]) {
			diff[name] = {
				type: 'added',
				'syntax-b': '',
				'syntax-a': definition.syntax,
				'comment': '',
			};

			continue;
		}

		if (a[name].syntax !== b[name].syntax) {
			diff[name] = {
				type: 'modified',
				'syntax-b': a[name].syntax,
				'syntax-a': b[name].syntax,
				'comment': '',
			};

			continue;
		}
	}

	return diff;
}

export function diff_atrule_sets(a, b) {
	const diff = Object(null);

	for (const [name, definition] of Object.entries(a)) {
		if (!definition.descriptors) {
			continue;
		}

		for (const [descriptor_name, descriptor_definition] of Object.entries(definition.descriptors)) {
			if (!b[name]?.descriptors?.[descriptor_name]) {
				diff[name] ??= {
					descriptors: {},
				};

				// Note: Currently impossible for items to be removed because we fork the existing syntax and add to it.
				diff[name].descriptors[descriptor_name] = {
					type: 'deleted',
					'syntax-b': descriptor_definition.syntax,
					'syntax-a': '',
					'comment': '',
				};

				continue;
			}
		}
	}

	for (const [name, definition] of Object.entries(b)) {
		if (!definition.descriptors) {
			continue;
		}

		for (const [descriptor_name, descriptor_definition] of Object.entries(definition.descriptors)) {
			if (!a[name]?.descriptors?.[descriptor_name]) {
				diff[name] ??= {
					descriptors: {},
				};

				diff[name].descriptors[descriptor_name] = {
					type: 'added',
					'syntax-b': '',
					'syntax-a': descriptor_definition.syntax,
					'comment': '',
				};

				continue;
			}

			if (a[name]?.descriptors?.[descriptor_name].syntax !== b[name]?.descriptors?.[descriptor_name].syntax) {
				diff[name] ??= {
					descriptors: {},
				};

				diff[name].descriptors[descriptor_name] = {
					type: 'modified',
					'syntax-b': a[name].descriptors?.[descriptor_name].syntax,
					'syntax-a': b[name].descriptors?.[descriptor_name].syntax,
					'comment': '',
				};

				continue;
			}
		}
	}

	return diff;
}
