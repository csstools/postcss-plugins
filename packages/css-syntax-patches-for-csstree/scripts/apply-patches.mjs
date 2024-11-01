export function apply_patches(patches, onto) {
	let flaws = 0;

	let has_missing_patches = false;
	let has_outdated_patches = false;
	let has_unmerged_patches = false;

	let atrules = Object(null);

	for (const [name, definition] of Object.entries(onto.atrules)) {
		for (const [descriptor_name, descriptor] of Object.entries(definition.descriptors)) {
			const patch = patches.atrules[name]?.descriptors[descriptor_name];
			if (!patch) {
				// eslint-disable-next-line no-console
				console.log(`Missing patch for descriptor '${descriptor_name}' for '@${name}'`);
				has_missing_patches = true;
				flaws++;

				continue;
			}

			if (
				patch['syntax-b'] !== descriptor['syntax-b'] ||
				patch['syntax-a'] !== descriptor['syntax-a']
			) {
				// eslint-disable-next-line no-console
				console.log(`Outdated patch for descriptor '${descriptor_name}' for '@${name}'`);
				has_outdated_patches = true;
				flaws++;

				continue;
			}

			if (patch.omit) {
				continue;
			}

			if (!patch['syntax-m']) {
				// eslint-disable-next-line no-console
				console.log(`Unmerged patch for descriptor '${descriptor_name}' for '@${name}'`);
				has_unmerged_patches = true;
				flaws++;

				continue;
			}

			if (patch['syntax-m'] === patch['syntax-b']) {
				// CSSTree is most correct
				continue;
			}

			atrules[name] ??= {
				descriptors: Object(),
			};

			atrules[name].descriptors[descriptor_name] = patch['syntax-m'];
		}
	}

	let properties = Object(null);

	for (const [name, definition] of Object.entries(onto.properties)) {
		const patch = patches.properties[name];
		if (!patch) {
			// eslint-disable-next-line no-console
			console.log(`Missing patch for property '${name}'`);
			has_missing_patches = true;
			flaws++;

			continue;
		}

		if (
			patch['syntax-b'] !== definition['syntax-b'] ||
			patch['syntax-a'] !== definition['syntax-a']
		) {
			// eslint-disable-next-line no-console
			console.log(`Outdated patch for property '${name}'`);
			has_outdated_patches = true;
			flaws++;

			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch['syntax-m']) {
			// eslint-disable-next-line no-console
			console.log(`Unmerged patch for property '${name}'`);
			has_unmerged_patches = true;
			flaws++;

			continue;
		}

		if (patch['syntax-m'] === patch['syntax-b']) {
			// CSSTree is most correct
			continue;
		}

		properties[name] = patch['syntax-m'];
	}

	let types = Object(null);

	// Manual patches to smooth over compat between csstree and webref/css
	types['dashed-ident'] = '<custom-property-name>';

	for (const [name, definition] of Object.entries(onto.types)) {
		const patch = patches.types[name];
		if (!patch) {
			// eslint-disable-next-line no-console
			console.log(`Missing patch for type '${name}'`);
			has_missing_patches = true;
			flaws++;

			continue;
		}

		if (
			patch['syntax-b'] !== definition['syntax-b'] ||
			patch['syntax-a'] !== definition['syntax-a']
		) {
			// eslint-disable-next-line no-console
			console.log(`Outdated patch for type '${name}'`);
			has_outdated_patches = true;
			flaws++;

			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch['syntax-m']) {
			// eslint-disable-next-line no-console
			console.log(`Unmerged patch for type '${name}'`);
			has_unmerged_patches = true;
			flaws++;

			continue;
		}

		if (patch['syntax-m'] === patch['syntax-b']) {
			// CSSTree is most correct
			continue;
		}

		types[name] = patch['syntax-m'];
	}

	return {
		atrules,
		properties,
		types,
		has_missing_patches,
		has_outdated_patches,
		has_unmerged_patches,
		flaws,
	};
}
