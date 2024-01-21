import parser from 'postcss-selector-parser';
const p = parser();

export function parse(selector) {
	return p.astSync(selector);
}
