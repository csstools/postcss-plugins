import parser from 'postcss-selector-parser';

/* Return a Selectors AST from a Selectors String
/* ========================================================================== */

export default selectorString => {
	let selectorAST;

	parser(selectors => {
		selectorAST = selectors
	}).processSync(selectorString);

	return selectorAST;
};
