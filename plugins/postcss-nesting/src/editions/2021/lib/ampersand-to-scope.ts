import type { Container, Node, Result, Rule } from 'postcss';
import parser from 'postcss-selector-parser';
import { sortCompoundSelectorsInsideComplexSelector } from './merge-selectors/compound-selector-order';
import { isAtRule } from '../../shared/lib/is-type-of-rule';

export default function ampersandToScope(rule: Rule, result: Result): void {
	let parent: Container<Node> = rule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			// Skip any rules that nested.
			// We only want to process "&" found in unnested rules.
			return;
		}

		if (isAtRule(parent) && parent.name === 'scope') {
			// Skip @scope rules.
			// These are newer than nesting and we don't want to break these.
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
		const parentNode = nesting.parent;

		nesting.replaceWith(parser.pseudo({
			value: ':scope',
		}));

		if (parentNode) {
			sortCompoundSelectorsInsideComplexSelector(parentNode);
		}
	});

	rule.selector = selectorAST.toString();
}
