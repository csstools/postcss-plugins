// We use CSS Tree for now, but if this ever becomes a real plugin we should look into optimizing the install size.
import * as definitionSyntax from 'css-tree/lib/definition-syntax/index.js';

import valueParser from 'postcss-value-parser';

export function parseAllSyntaxDefinition(definitions: string): Array<{ valid: boolean, buckets: number, definition: string }> {
	const ast = valueParser(definitions);

	const parsedDefinitions = [];

	for (let i = 0; i < ast.nodes.length; i++) {
		if (ast.nodes[i].type === 'string') {
			parsedDefinitions.push(ast.nodes[i].value);
		}
	}

	return parsedDefinitions.map((definition) => parseSyntaxDefinition(definition));
}

export function parseSyntaxDefinition(definition: string): { valid: boolean, buckets: number, definition: string } {

	const ast = definitionSyntax.parse('['+definition+']');

	let valid = true;
	let sawRoot = false;
	definitionSyntax.walk(ast, {
		enter(node) {
			if (!sawRoot) {
				sawRoot = true;
				return;
			}

			if (node.type === 'Multiplier') {
				valid = false;
				return;
			}

			if (node.type === 'Group') {
				if (node.combinator !== '|') {
					valid = false;
					return;
				}

				return false;
			}

			if (
				[
					'Function',
					'Keyword',
					'Property',
					'Range',
					'String',
					'Type',
				].includes(node.type)
			) {
				return;
			}

			valid = false;
			return;
		},
	});

	return {
		valid: valid,
		buckets: ast.terms.length,
		definition: definition,
	};
}
