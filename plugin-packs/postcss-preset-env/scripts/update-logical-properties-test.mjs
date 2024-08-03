import css from '@webref/css';
import fs from 'node:fs/promises';

const logicalProperties = new Set();

const parsedFiles = await css.listAll();
for (const [, data] of Object.entries(parsedFiles)) {
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
