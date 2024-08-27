// TODO:
// - toposort
//   - check cycles
//   - check missing definitions
// - patches
//   1. generate csstree syntaxes
//   2. generate webref syntaxes
//   3. take a diff
//   4. for each entry with a difference there should be a matching entry in a `patches.json` file
//   5. each patch entry needs to match the source of csstree and the source of webref
//   6. the manually resolved conflict is also stored in the `patches.json` file
//   This gives us an automated mechanic to detect updates and to ensure that `patches.json` is always as small as needed
// - backwards compat
//   given that syntaxes are extensive users might depend on a specific type. No types can be removed or altered in a breaking way in semver patches or minors

import { fork, parse } from 'css-tree';

import { generate_csstree_sets } from './generate-csstree-sets.mjs';
import { generate_webref_sets } from './generate-webref-sets.mjs';
import { write_set_files } from './write-set-files.mjs';
import { diff_sets } from './diff-sets.mjs';
import { read_patches } from './read-patches.mjs';
import { write_final_file } from './write-final-file.mjs';
import { apply_patches } from './apply-patches.mjs';

const csstree_sets = await generate_csstree_sets();
const webref_sets = await generate_webref_sets();

const patches = await read_patches();

const webref_over_csstree_sets = {
	properties: diff_sets(csstree_sets.properties, webref_sets.properties),
	types: diff_sets(csstree_sets.types, webref_sets.types),
};

const SINGULAR = {
	'types': 'type',
	'properties': 'property',
};

let has_missing_patch_tests = false;
let has_invalid_items = false;
let has_failing_tests = false;
let flaws = 0;

const {
	properties: property_patches,
	types: type_patches,
	has_missing_patches,
	has_outdated_patches,
	has_unmerged_patches,
	flaws: patch_flaws,
} = apply_patches(patches.webref_over_csstree, webref_over_csstree_sets);

flaws += patch_flaws;

const forkedLexer = fork({
	properties: property_patches,
	types: type_patches,
}).lexer;

const invalid = forkedLexer.validate();
if (invalid) {
	for (const [kind, items] of Object.entries(invalid)) {
		items.forEach((item) => {
			console.log(`Unexpected invalid ${SINGULAR[kind]} '${item}'`);
			has_invalid_items = true;
			flaws++;
		});
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

	for (const test of (patch.tests.passing ?? [])) {
		const csstree_value_node = parse(test.value, { context: 'value' });
		const result = forkedLexer.matchProperty(name, csstree_value_node);
		if (result.error) {
			console.log(`Expected no error for '${name}: ${test.value}'`);
			flaws++;
		}
	}


	for (const test of (patch.tests.failing ?? [])) {
		const csstree_value_node = parse(test.value, { context: 'value' });
		const result = forkedLexer.matchProperty(name, csstree_value_node);
		if (!result.error) {
			console.log(`Expected an error for '${name}: ${test.value}'`);
			flaws++;
		}
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

	for (const test of (patch.tests.passing ?? [])) {
		const csstree_value_node = parse(test.value, { context: 'value' });
		const result = forkedLexer.matchProperty(test.property, csstree_value_node);
		if (result.error) {
			console.log(`Expected no error for '${test.property}: ${test.value}'`);
			flaws++;
		}
	}


	for (const test of (patch.tests.failing ?? [])) {
		const csstree_value_node = parse(test.value, { context: 'value' });
		const result = forkedLexer.matchProperty(test.property, csstree_value_node);
		if (!result.error) {
			console.log(`Expected an error for '${test.property}: ${test.value}'`);
			flaws++;
		}
	}
}

await write_set_files({
	csstree: csstree_sets,
	webref: webref_sets,
	webref_over_csstree: webref_over_csstree_sets,
});

await write_final_file({
	next: {
		properties: property_patches,
		types: type_patches,
	},
});

{
	if (has_missing_patches || has_outdated_patches || has_unmerged_patches || has_missing_patch_tests || has_invalid_items || has_failing_tests) {
		console.log('-------------------');
	}

	if (has_missing_patches) {
		console.warn('Not all patches have been merged');
	}

	if (has_outdated_patches) {
		console.warn('Not all patches have been updated');
	}

	if (has_unmerged_patches) {
		console.warn('Not all patches have been merged');
	}

	if (has_missing_patch_tests) {
		console.warn('Not all patches have test coverage');
	}

	if (has_invalid_items) {
		console.warn('Not all types or properties are valid');
	}

	if (has_failing_tests) {
		console.warn('Not all tests passed');
	}

	console.log(`${flaws} flaws to resolve`);


	if (has_missing_patches || has_outdated_patches || has_unmerged_patches || has_missing_patch_tests || has_invalid_items || has_failing_tests) {
		process.exit(1);
	}
}
