export function apply_patches(patches, onto) {
	let flaws = 0;

	let has_missing_patches = false;
	let has_outdated_patches = false;
	let has_unmerged_patches = false;

	let atrules = Object.create(null);

	for (const [name, definition] of Object.entries(onto.atrules)) {
		const prelude = definition.prelude;
		if (!prelude) {
			// unsure if we can continue if there is no prelude here
			continue;
		}

		const patch = patches.atrules[name]?.prelude;
		if (!patch) {
			// eslint-disable-next-line no-console
			console.log(`Missing patch for prelude for '@${name}'`);
			has_missing_patches = true;
			flaws++;

			continue;
		}

		if (
			patch['syntax-b'] !== prelude['syntax-b'] ||
			patch['syntax-a'] !== prelude['syntax-a']
		) {
			// eslint-disable-next-line no-console
			console.log(`Outdated patch for prelude for '@${name}'`);
			has_outdated_patches = true;
			flaws++;

			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch['syntax-m']) {
			// eslint-disable-next-line no-console
			console.log(`Unmerged patch for prelude for '@${name}'`);
			has_unmerged_patches = true;
			flaws++;

			continue;
		}

		if (patch['syntax-m'] === patch['syntax-b']) {
			// CSSTree is most correct
			continue;
		}

		atrules[name] ??= Object.create(null);
		atrules[name].prelude = patch['syntax-m'];
	}

	for (const [name, definition] of Object.entries(onto.atrules)) {
		if (definition.descriptors) {
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

				atrules[name] ??= Object.create(null);
				atrules[name].descriptors ??= Object.create(null);
				atrules[name].descriptors[descriptor_name] = patch['syntax-m'];
			}
		}
	}

	let properties = Object.create(null);

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

	let types = Object.create(null);

	// Manual patches to smooth over compat between csstree and webref/css
	types['dashed-ident'] = '<custom-property-name>';
	types['extension-name'] = '<custom-property-name>';
	types['custom-selector'] = '<custom-property-name>';
	types['dashed-function'] = '<function-token> <any-value>? )';
	types['unicode-range-token'] = '<urange>';

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
