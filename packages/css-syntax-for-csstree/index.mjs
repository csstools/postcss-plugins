import fs from 'node:fs/promises';

import css from '@webref/css';
import { fork, definitionSyntax, lexer } from 'css-tree';

// TODO: toposort
// TODO: circular checks
// TODO: missing types/props checks


const propertiesSyntaxPatches = {
	// overflow: '| overlay', // csstree/csstree#248
	// width: '| min-intrinsic | -moz-min-content | -moz-available | -webkit-fill-available', // csstree/csstree#242
	// 'field-sizing': 'content | fixed',
	// 'text-box-edge':
	// 	'auto | [ text | cap | ex | ideographic | ideographic-ink ] [ text | alphabetic | ideographic | ideographic-ink ]?',
	// 'text-box-trim': 'none | trim-start | trim-end | trim-both',
	// 'text-spacing-trim': 'normal | space-all | space-first | trim-start',
	// 'text-wrap-style': 'auto | balance | pretty | stable',
	// 'word-break': '| auto-phrase | auto-phrase',
	// 'view-transition-name': 'none | <custom-ident>',
	// 'anchor-name': 'none | <custom-property-name>#',
};

function generate_set(source) {
	const set = Object(null);

	for (const key in source) {
		if (!Object.prototype.hasOwnProperty.call(source, key)) {
			continue;
		}

		if (!source[key].syntax) {
			// console.log('no syntax for', key);

			continue;
		}

		set[key] = {
			syntax: definitionSyntax.generate(source[key].syntax),
		};
	}

	return set;
}

function webref_css_to_csstree(definition) {
	if (definition.newValues) {
		console.log(definition.values ?? '-');
		console.log(definition.newValues ?? '-');
		console.log('------------------');
	}

	return {
		syntax: definitionSyntax.parse(definition.value ?? definition.newValues),
	};
}

await fs.writeFile(
	'csstree-properties.json',
	JSON.stringify(generate_set(lexer.properties), null, '\t'),
	'utf-8',
);

await fs.writeFile(
	'csstree-types.json',
	JSON.stringify(generate_set(lexer.types), null, '\t'),
	'utf-8',
);

{
	const set = Object(null);

	const parsedFiles = await css.listAll();
	for (const [, data] of Object.entries(parsedFiles)) {
		for (const property of data.properties) {
			if (property.value) {
				set[property.name] = webref_css_to_csstree(property);
			} else {
				console.log(property);

			}
		}
	}

	await fs.writeFile(
		'webref-css-properties-a.json',
		JSON.stringify(generate_set(set), null, '\t'),
		'utf-8',
	);
}

{
	const set = Object(null);

	const parsedFiles = await css.listAll();
	for (const [, data] of Object.entries(parsedFiles)) {
		console.log(Object.keys(data));

		for (const property of data.properties) {
			if (property.value) {
				set[property.name] = property.value ?? property.newValues;
			} else {
				console.log(property);
			}
		}
	}

	const forkedLexer = fork({
		properties: set,
		types: {},
	}).lexer;

	await fs.writeFile(
		'webref-css-properties-b.json',
		JSON.stringify(generate_set(forkedLexer.properties), null, '\t'),
		'utf-8',
	);
}
