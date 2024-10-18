import { lexer } from 'css-tree-3.0.0';
import { generate_set } from './generate-set.mjs';

export async function generate_csstree_sets() {
	return {
		properties: generate_set(lexer.properties),
		types: generate_set(lexer.types),
	};
}
