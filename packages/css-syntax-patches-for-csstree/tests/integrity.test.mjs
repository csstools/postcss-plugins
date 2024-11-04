import { fork, definitionSyntax } from 'css-tree-3';
import fs from 'fs/promises';
import path from 'path';


let has_missing_types = false;
let has_missing_properties = false;
let flaws = 0;

const next = JSON.parse(await fs.readFile(path.join('dist', 'index.json'), 'utf-8')).next;

const forkedLexer = fork({
	atrules: next.atrules,
	properties: next.properties,
	types: next.types,
}).lexer;

const known_properties = new Set([...Object.keys(forkedLexer.properties)]);
const known_types = new Set([...Object.keys(forkedLexer.types)]);

// Atrules
for (const atrule of Object.values(forkedLexer.atrules)) {
	if (!atrule.descriptors) {
		continue;
	}

	for (const descriptor of Object.values(atrule.descriptors)) {
		if (!descriptor.syntax) {
			continue;
		}

		definitionSyntax.walk(descriptor.syntax, (node) => {
			if (node.type === 'Type' && !known_types.has(node.name)) {
				// eslint-disable-next-line no-console
				console.log(`Unexpected missing type '${node.name}' in '${descriptor.name}'`);
				has_missing_types = true;
				flaws++;
			}

			if (node.type === 'Property' && !known_properties.has(node.name)) {
				// eslint-disable-next-line no-console
				console.log(`Unexpected missing property '${node.name}' in '${descriptor.name}'`);
				has_missing_properties = true;
				flaws++;
			}
		});
	}
}

// Properties
for (const property of Object.values(forkedLexer.properties)) {
	if (!property.syntax) {
		continue;
	}

	definitionSyntax.walk(property.syntax, (node) => {
		if (node.type === 'Type' && !known_types.has(node.name)) {
			// eslint-disable-next-line no-console
			console.log(`Unexpected missing type '${node.name}' in '${property.name}'`);
			has_missing_types = true;
			flaws++;
		}

		if (node.type === 'Property' && !known_properties.has(node.name)) {
			// eslint-disable-next-line no-console
			console.log(`Unexpected missing property '${node.name}' in '${property.name}'`);
			has_missing_properties = true;
			flaws++;
		}
	});
}

// Types
for (const type of Object.values(forkedLexer.types)) {
	if (!type.syntax) {
		continue;
	}

	definitionSyntax.walk(type.syntax, (node) => {
		if (node.type === 'Type' && !known_types.has(node.name)) {
			// eslint-disable-next-line no-console
			console.log(`Unexpected missing type '${node.name}' in '${type.name}'`);
			has_missing_types = true;
			flaws++;
		}

		if (node.type === 'Property' && !known_properties.has(node.name)) {
			// eslint-disable-next-line no-console
			console.log(`Unexpected missing property '${node.name}' in '${type.name}'`);
			has_missing_properties = true;
			flaws++;
		}
	});
}

{
	if (flaws || has_missing_properties || has_missing_types) {
		// eslint-disable-next-line no-console
		console.log('-------------------');

		// eslint-disable-next-line no-console
		console.log(`${flaws} flaws to resolve`);

		process.exit(1);
	}
}
