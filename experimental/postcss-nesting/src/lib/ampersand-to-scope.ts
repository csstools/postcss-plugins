import type { Container, Node, Rule } from 'postcss';
import parser from 'postcss-selector-parser';

export default function ampersandToScope(rule: Rule) {
	let parent: Container<Node> = rule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			return;
		}

		parent = parent.parent;
	}

	const selectorAST = parser().astSync(rule.selector);
	if (!selectorAST) {
		return;
	}

	selectorAST.walkNesting((nesting) => {
		nesting.replaceWith(parser.pseudo({value: ':scope'}));
	});

	rule.selector = selectorAST.toString();
}
