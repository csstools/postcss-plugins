import type { Container, Node, Result, Rule } from 'postcss';
import { isAtRule } from '../../shared/lib/is-type-of-rule';
import mergeSelectors from './merge-selectors';
import parser from 'postcss-selector-parser';

export default function ampersandToScope(rule: Rule, result: Result): void {
	{
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

		try {
			let isNestContaining = false;
			parser().astSync(rule.selector).walkNesting(() => {
				isNestContaining = true;
				return false;
			});

			if (!isNestContaining) {
				// Skip any selectors that do not contain an actual `&` token;
				return;
			}
		} catch (err) {
			rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
			return;
		}
	}

	const selectors = mergeSelectors(rule, rule.selector, ':scope', result);
	if (!selectors) {
		return;
	}

	rule.selector = selectors;
}
