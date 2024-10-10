import css from '@webref/css';
import fs from 'node:fs/promises';

const logicalProperties = new Set();

const parsedFiles = await css.listAll();
const entries = Array.from(Object.entries(parsedFiles));

entries.sort((a, b) => {
	const name_a = a[0].replace(/-\d+$/, '');
	const name_b = b[0].replace(/-\d+$/, '');

	if (name_a !== name_b) {
		return name_a.localeCompare(name_b);
	}

	const level_a = parseInt((a[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);
	const level_b = parseInt((b[0].match(/-(\d+)$/) ?? [])[1] ?? '0', 10);

	return level_a - level_b;
});

for (const [, data] of entries) {
	for (const property of data.properties) {
		if (property.logicalPropertyGroup) {
			logicalProperties.add(property);
		}
	}
}

const properties = Array.from(logicalProperties);
properties.sort((a, b) => {
	if (a.logicalPropertyGroup === b.logicalPropertyGroup) {
		return a.name.localeCompare(b.name);
	}

	return a.logicalPropertyGroup.localeCompare(b.logicalPropertyGroup);
});

let buffer = '/* This test aims to make it easy to find new logical properties that don\'t have a transform. */\n\n';

for (const property of properties) {
	buffer += `.${property.logicalPropertyGroup.toLowerCase()} {
	/* ${property.name} */
	${property.name}: inherit;
}

`;
}

await fs.writeFile('test/logical-properties.css', buffer);
