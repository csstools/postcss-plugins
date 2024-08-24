import fs from 'fs/promises';
import { fork, definitionSyntax } from 'css-tree';


const propertiesSyntax = {
	overflow: '| overlay', // csstree/csstree#248
	width: '| min-intrinsic | -moz-min-content | -moz-available | -webkit-fill-available', // csstree/csstree#242
	'field-sizing': 'content | fixed',
	'text-box-edge':
		'auto | [ text | cap | ex | ideographic | ideographic-ink ] [ text | alphabetic | ideographic | ideographic-ink ]?',
	'text-box-trim': 'none | trim-start | trim-end | trim-both',
	'text-spacing-trim': 'normal | space-all | space-first | trim-start',
	'text-wrap-style': 'auto | balance | pretty | stable',
	'word-break': '| auto-phrase | auto-phrase',
};

const forkedLexer = fork({
	properties: {},
	types: {},
}).lexer;

{
	const propertiesSyntax = Object(null);

	for (const key in forkedLexer.properties) {
		if (!Object.prototype.hasOwnProperty.call(forkedLexer.properties, key)) {
			continue;
		}

		if (!forkedLexer.properties[key].syntax) {
			console.log('no syntax for property', key);

			continue;
		}

		propertiesSyntax[key] = {
			'syntax': definitionSyntax.generate(forkedLexer.properties[key].syntax),
		};
	}

	await fs.writeFile(
		'properties-syntax.json',
		JSON.stringify(propertiesSyntax, null, '\t'),
		'utf-8',
	);
}

{
	const typesSyntax = Object(null);

	for (const key in forkedLexer.types) {
		if (!Object.prototype.hasOwnProperty.call(forkedLexer.types, key)) {
			continue;
		}

		if (!forkedLexer.types[key].syntax) {
			console.log('no syntax for type', key);

			continue;
		}

		typesSyntax[key] = {
			'syntax': definitionSyntax.generate(forkedLexer.types[key].syntax),
		};
	}

	await fs.writeFile(
		'types-syntax.json',
		JSON.stringify(typesSyntax, null, '\t'),
		'utf-8',
	);
}
