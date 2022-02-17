import css from '@webref/css';
import { promises as fsp } from 'fs';

const inherited = new Set();
const nonInherited = new Set();

// TODO : sometimes properties have both.
// Is this a difference between specs?
// Is this for different elements or contexts?
// Is this something else?
// Needs more logs and investigating!

generate();
async function generate() {
	const parsedFiles = await css.listAll();
	for (const [, data] of Object.entries(parsedFiles)) {
		for (const propertyName in data.properties) {
			const property = data.properties[propertyName];
			if (property.name.indexOf('-') === 0) {
				// vendor prefix
				continue;
			}

			if (property.newValues) {
				continue;
			}

			if ((property.inherited ?? '').toLowerCase() === 'see individual properties' || (property.initial ?? '').toLowerCase() === 'see individual properties') {
				continue;
			}

			if (property.inherited === 'yes') {
				inherited.add(property.name);
				if (nonInherited.has(property.name)) {
					console.error(`${property.name} is already defined as non-inherited`);
					process.exit(1);
				}
			} else {
				nonInherited.add(property.name);
				if (inherited.has(property.name)) {
					console.error(`${property.name} is already defined as inherited`);
					process.exit(1);
				}
			}
		}
	}

	await fsp.writeFile(
		'src/property-def.ts',
		`// This file is generated by generate/property-def.mjs
export const inherited : Set<string> = new Set(${JSON.stringify(Array.from(inherited.values()))});

export const nonInherited : Set<string> = new Set(${JSON.stringify(Array.from(nonInherited.values()))});
`,
	);
}

