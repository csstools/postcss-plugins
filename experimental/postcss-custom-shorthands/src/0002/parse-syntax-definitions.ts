import valueParser from 'postcss-value-parser';
import { parseConstituentProperties } from './parse-constituent-properties';

export function parseAllSyntaxDefinition(definitions: string): Array<{ valid: boolean, buckets: number }> {
	const ast = valueParser(definitions);

	const parsedDefinitions = [];

	for (let i = 0; i < ast.nodes.length; i++) {
		if (ast.nodes[i].type === 'string') {
			const slots = parseConstituentProperties(ast.nodes[i].value);
			parsedDefinitions.push({
				valid: true,
				buckets: slots.length,
			});
		}
	}

	return parsedDefinitions;
}
