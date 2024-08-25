export function diff_sets(a, b) {
	const diff = Object(null);

	for (const [name, definition] of Object.entries(a)) {
		if (!b[name]) {
			// Note: Currently impossible for items to be removed because we fork the existing syntax and add to it.
			diff[name] = {
				type: 'deleted',
				'syntax-before': definition.syntax,
				'syntax-after': '',
				'comment': '',
			};

			continue;
		}
	}

	for (const [name, definition] of Object.entries(b)) {
		if (!a[name]) {
			diff[name] = {
				type: 'added',
				'syntax-before': '',
				'syntax-after': definition.syntax,
				'comment': '',
			};

			continue;
		}

		if (a[name].syntax !== b[name].syntax) {
			diff[name] = {
				type: 'modified',
				'syntax-before': a[name].syntax,
				'syntax-after': b[name].syntax,
				'comment': '',
			};

			continue;
		}
	}

	return diff;
}
