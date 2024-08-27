export function apply_patches(patches, onto) {
	let flaws = 0;

	let has_missing_patches = false;
	let has_outdated_patches = false;
	let has_unmerged_patches = false;

	let properties = Object(null);

	for (const [name, definition] of Object.entries(onto.properties)) {
		const patch = patches.properties[name];
		if (!patch) {
			console.log(`Missing patch for property '${name}'`);
			has_missing_patches = true;
			flaws++;

			continue;
		}

		if (
			patch['syntax-before'] !== definition['syntax-before'] ||
			patch['syntax-after'] !== definition['syntax-after']
		) {
			console.log(`Outdated patch for property '${name}'`);
			has_outdated_patches = true;
			flaws++;

			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch['merged']) {
			console.log(`Unmerged patch for property '${name}'`);
			has_unmerged_patches = true;
			flaws++;

			continue;
		}

		properties[name] = patch['merged'];
	}

	let types = Object(null);

	for (const [name, definition] of Object.entries(onto.types)) {
		const patch = patches.types[name];
		if (!patch) {
			console.log(`Missing patch for property '${name}'`);
			has_missing_patches = true;
			flaws++;

			continue;
		}

		if (
			patch['syntax-before'] !== definition['syntax-before'] ||
			patch['syntax-after'] !== definition['syntax-after']
		) {
			console.log(`Outdated patch for property '${name}'`);
			has_outdated_patches = true;
			flaws++;

			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch['merged']) {
			console.log(`Unmerged patch for property '${name}'`);
			has_unmerged_patches = true;
			flaws++;

			continue;
		}

		types[name] = patch['merged'];
	}

	// Manual patches to smooth over compat between csstree and webref/css
	types['dashed-ident'] = '<custom-property-name>';

	return {
		properties,
		types,
		has_missing_patches,
		has_outdated_patches,
		has_unmerged_patches,
		flaws,
	};
}
