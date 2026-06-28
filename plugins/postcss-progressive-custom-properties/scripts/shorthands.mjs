import css from '@webref/css';
import fs from 'node:fs/promises';

const shorthands = new Map();

const listedProperties = (await css.listAll()).properties;

for (const property of listedProperties) {
	if (property.name.startsWith('-webkit-')) {
		continue;
	}

	if (property.name.startsWith('-moz-')) {
		continue;
	}

	if (property.name.startsWith('-ms-')) {
		continue;
	}

	if (property.name.startsWith('-o-')) {
		continue;
	}

	if (property.name.startsWith('tbd-') || property.name.includes('-tbd-') || property.name.endsWith('-tbd')) {
		continue;
	}

	if (property.longhands?.length || property.resetLonghands?.length) {
		let list = shorthands.get(property.name) ?? new Set();

		if (property.longhands?.length) {
			property.longhands.forEach((x) => list.add(x));
		}

		if (property.resetLonghands?.length) {
			property.resetLonghands.forEach((x) => list.add(x));
		}

		shorthands.set(property.name, list);
	}

	if (property.logicalPropertyGroup) {
		let list = shorthands.get(property.logicalPropertyGroup) ?? new Set();

		list.add(property.name);

		shorthands.set(property.logicalPropertyGroup, list);
	}
}

function flatten(x) {
	let didFlatten = false;

	for (const [shorthand, longhands] of x) {
		for (const longhand of longhands) {
			const deeper = x.get(longhand);
			if (deeper?.size) {
				const joined = new Set([...longhands, ...deeper]);
				if (!joined.isSubsetOf(longhands)) {
					didFlatten = true;

					x.set(shorthand, joined);
				}
			}
		}
	}

	if (didFlatten) {
		return flatten(x);
	}

	return x;
}

const output = [];
for (const [shorthand, longhands] of flatten(shorthands)) {
	output.push([
		shorthand,
		[...longhands],
	]);
}

await fs.writeFile(
	'./src/shorthands.ts',
	'export const shorthands = new Map(' + JSON.stringify(output, null, '\t') + ');\n');
