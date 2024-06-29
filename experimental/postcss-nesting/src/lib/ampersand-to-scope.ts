import type { Container, Node, Result, Rule } from 'postcss';
import parser from 'postcss-selector-parser';

export default function ampersandToScope(rule: Rule, result: Result): void {
	let parent: Container<Node> = rule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			return;
		}

		parent = parent.parent;
	}

	let selectorAST: parser.Root;
	try {
		selectorAST = parser().astSync(rule.selector);
	} catch (err) {
		if (!(err instanceof Error)) {
			throw err;
		}

		rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${err.message}"`);
		return;
	}
	if (!selectorAST) {
		return;
	}

	selectorAST.walkNesting((nesting) => {
		if (nesting.parent?.parent?.type === 'root') {
			nesting.replaceWith(parser.pseudo({
				value: ':scope',
			}));
		} else {
			// :has(&) != :has(:scope)
			nesting.replaceWith(parser.pseudo({
				value: ':is',
				nodes: [
					parser.pseudo({
						value: ':root',
					}),
					parser.pseudo({
						value: ':host',
					}),
				],
			}));
		}
	});

	rule.selector = selectorAST.toString();
}
