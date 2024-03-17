import type { Container, Node, Result, Rule } from 'postcss';
import parser from 'postcss-selector-parser';

export default function ampersandToScope(rule: Rule, result: Result): void {
	let parent: Container<Node> = rule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			// Skip any rules that nested.
			// We only want to process "&" found in unnested rules.
			return;
		}

		parent = parent.parent;
	}

	let selectorAST: parser.Root;
	try {
		selectorAST = parser().astSync(rule.selector);
	} catch (err) {
		rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
		return;
	}
	if (!selectorAST) {
		return;
	}

	selectorAST.walkNesting((nesting) => {
		nesting.replaceWith(parser.pseudo({
			value: ':scope',
		}));
	});

	rule.selector = selectorAST.toString();
}
