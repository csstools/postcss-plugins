// TODO:
// - toposort
//   - check cycles
//   - check missing definitions
// - backwards compat
//   given that syntaxes are extensive users might depend on a specific type. No types can be removed or altered in a breaking way in semver patches or minors

import { generate_csstree_sets } from './generate-csstree-sets.mjs';
import { generate_webref_sets } from './generate-webref-sets.mjs';
import { write_set_files } from './write-set-files.mjs';
import { diff_atrule_sets, diff_sets } from './diff-sets.mjs';
import { read_patches } from './read-patches.mjs';
import { write_final_file } from './write-final-file.mjs';
import { apply_patches } from './apply-patches.mjs';
import { write_patches } from './write-patches.mjs';

const csstree_sets = await generate_csstree_sets();
const webref_sets = await generate_webref_sets();

const patches = await read_patches();

const webref_over_csstree_sets = {
	atrules: diff_atrule_sets(csstree_sets.atrules, webref_sets.atrules),
	properties: diff_sets(csstree_sets.properties, webref_sets.properties),
	types: diff_sets(csstree_sets.types, webref_sets.types),
};

let has_missing_patch_tests = false;
let flaws = 0;

const {
	atrules: atrule_patches,
	properties: property_patches,
	types: type_patches,
	has_missing_patches,
	has_outdated_patches,
	has_unmerged_patches,
	flaws: patch_flaws,
} = apply_patches(patches.webref_over_csstree, webref_over_csstree_sets);

flaws += patch_flaws;

// Atrules
for (const [name, atrule] of Object.entries(webref_over_csstree_sets.atrules)) {
	for (const [descriptor_name] of Object.entries(atrule.descriptors)) {
		const patch = patches.webref_over_csstree.atrules[name].descriptors[descriptor_name];
		if (!patch) {
			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch.tests) {
			has_missing_patch_tests = true;
			continue;
		}
	}
}

// Properties
for (const [name] of Object.entries(webref_over_csstree_sets.properties)) {
	const patch = patches.webref_over_csstree.properties[name];
	if (!patch) {
		continue;
	}

	if (patch.omit) {
		continue;
	}

	if (!patch.tests) {
		has_missing_patch_tests = true;
		continue;
	}
}

// Types
for (const [name] of Object.entries(webref_over_csstree_sets.types)) {
	const patch = patches.webref_over_csstree.types[name];
	if (!patch) {
		continue;
	}

	if (patch.omit) {
		continue;
	}

	if (!patch.tests) {
		has_missing_patch_tests = true;
		continue;
	}
}

await write_set_files({
	csstree: csstree_sets,
	webref: webref_sets,
	webref_over_csstree: webref_over_csstree_sets,
});

await write_patches(
	{
		webref_over_csstree: webref_over_csstree_sets,
	},
	patches,
);

await write_final_file({
	next: {
		atrules: atrule_patches,
		properties: property_patches,
		types: type_patches,
	},
});

{
	if (has_missing_patches || has_outdated_patches || has_unmerged_patches || has_missing_patch_tests) {
		// eslint-disable-next-line no-console
		console.log('-------------------');
	}

	if (has_missing_patches) {
		// eslint-disable-next-line no-console
		console.warn('Not all patches have been merged');
	}

	if (has_outdated_patches) {
		// eslint-disable-next-line no-console
		console.warn('Not all patches have been updated');
	}

	if (has_unmerged_patches) {
		// eslint-disable-next-line no-console
		console.warn('Not all patches have been merged');
	}

	if (has_missing_patch_tests) {
		// eslint-disable-next-line no-console
		console.warn('Not all patches have test coverage');
	}

	if (has_missing_patches || has_outdated_patches || has_unmerged_patches || has_missing_patch_tests) {
		// eslint-disable-next-line no-console
		console.log(`${flaws} flaws to resolve`);

		process.exit(1);
	}
}
