import { lexer } from 'css-tree';
import { generate_atrule_set, generate_set } from './generate-set.mjs';

export async function generate_csstree_sets() {
	return {
		atrules: generate_atrule_set(lexer.atrules),
		properties: generate_set(lexer.properties),
		types: generate_set(lexer.types),
	};
}
