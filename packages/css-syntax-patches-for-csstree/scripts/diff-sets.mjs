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
