import { fork } from 'css-tree-3.0.0';
import fs from 'fs/promises';
import path from 'path';

const SINGULAR = {
	'atrules': 'atrule',
	'properties': 'property',
	'types': 'type',
};

let has_invalid_items = false;
let has_failing_tests = false;
let flaws = 0;

const patches = {
	atrules: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-atrules.json'), 'utf-8')),
	properties: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-properties.json'), 'utf-8')),
	types: JSON.parse(await fs.readFile(path.join('patches', 'webref-over-csstree-types.json'), 'utf-8')),
};

const next = JSON.parse(await fs.readFile(path.join('dist', 'index.json'), 'utf-8')).next;

const forkedLexer = fork({
	atrules: next.atrules,
	properties: next.properties,
	types: next.types,
}).lexer;

const invalid = forkedLexer.validate();
if (invalid) {
	for (const [kind, items] of Object.entries(invalid)) {
		items.forEach((item) => {
			// eslint-disable-next-line no-console
			console.log(`Unexpected invalid ${SINGULAR[kind]} '${item}'`);
			has_invalid_items = true;
			flaws++;
		});
	}
}

// Atrules
for (const [name, atrule] of Object.entries(patches.atrules)) {
	for (const [descriptor_name] of Object.entries(atrule.descriptors)) {
		const patch = patches.atrules[name].descriptors[descriptor_name];
		if (!patch) {
			continue;
		}

		if (patch.omit) {
			continue;
		}

		if (!patch.tests) {
			continue;
		}

		for (const test of (patch.tests.passing ?? [])) {
			try {
				const result = forkedLexer.matchAtruleDescriptor(name, descriptor_name, test.value);
				if (!result.error) {
					continue;
				}

			} catch { }

			// eslint-disable-next-line no-console
			console.log(`Expected no error for '@${name}' and '${descriptor_name}: ${test.value}'`);
			flaws++;
		}

		for (const test of (patch.tests.failing ?? [])) {
			try {
				const result = forkedLexer.matchAtruleDescriptor(name, descriptor_name, test.value);
				if (result.error) {
					continue;
				}
			} catch {
				continue;
			}

			// eslint-disable-next-line no-console
			console.log(`Expected an error for '@${name}' and '${descriptor_name}: ${test.value}'`);
			flaws++;
		}
	}
}

// Properties
for (const [name] of Object.entries(patches.properties)) {
	const patch = patches.properties[name];
	if (!patch) {
		continue;
	}

	if (patch.omit) {
		continue;
	}

	if (!patch.tests) {
		continue;
	}

	for (const test of (patch.tests.passing ?? [])) {
		try {
			const result = forkedLexer.matchProperty(name, test.value);
			if (!result.error) {
				continue;
			}

		} catch { }

		// eslint-disable-next-line no-console
		console.log(`Expected no error for '${name}: ${test.value}'`);
		flaws++;
	}

	for (const test of (patch.tests.failing ?? [])) {
		try {
			const result = forkedLexer.matchProperty(name, test.value);
			if (result.error) {
				continue;
			}
		} catch {
			continue;
		}

		// eslint-disable-next-line no-console
		console.log(`Expected an error for '${name}: ${test.value}'`);
		flaws++;
	}
}

// Types
for (const [name] of Object.entries(patches.types)) {
	const patch = patches.types[name];
	if (!patch) {
		continue;
	}

	if (patch.omit) {
		continue;
	}

	if (!patch.tests) {
		continue;
	}

	for (const test of (patch.tests.passing ?? [])) {
		try {
			const result = forkedLexer.matchProperty(test.property, test.value);
			if (!result.error) {
				continue;
			}

		} catch {}

		// eslint-disable-next-line no-console
		console.log(`Expected no error for '${test.property}: ${test.value}'`);
		flaws++;
	}

	for (const test of (patch.tests.failing ?? [])) {
		try {
			const result = forkedLexer.matchProperty(test.property, test.value);
			if (result.error) {
				continue;
			}
		} catch {
			continue;
		}

		// eslint-disable-next-line no-console
		console.log(`Expected an error for '${test.property}: ${test.value}'`);
		flaws++;
	}
}

{
	if (has_invalid_items || has_failing_tests) {
		// eslint-disable-next-line no-console
		console.log('-------------------');
	}

	if (has_invalid_items) {
		// eslint-disable-next-line no-console
		console.warn('Not all types or properties are valid');
	}

	if (has_failing_tests) {
		// eslint-disable-next-line no-console
		console.warn('Not all tests passed');
	}

	if (has_invalid_items || has_failing_tests) {
		// eslint-disable-next-line no-console
		console.log(`${flaws} flaws to resolve`);

		process.exit(1);
	}
}
