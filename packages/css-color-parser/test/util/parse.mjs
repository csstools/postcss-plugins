import { tokenize } from '@csstools/css-tokenizer';
import { parseComponentValue } from '@csstools/css-parser-algorithms';

export function parse(css) {
	return parseComponentValue(tokenize({ css: css }), {});
}
