import valueParser from 'postcss-values-parser';

export function parse (string) {
	return valueParser(string).parse();
}
