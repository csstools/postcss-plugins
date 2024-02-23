import type { ChildNode, Container } from 'postcss';

function isMixinAtRule(node: ChildNode): boolean {
	return node.type === 'atrule' && node.name.toLowerCase() === 'mixin';
}

function isNonMixinAtRule(node: ChildNode): boolean {
	return node.type === 'atrule' && !isMixinAtRule(node);
}

export default function groupDeclarations(node: Container<ChildNode>) {
	// https://drafts.csswg.org/css-nesting/#mixing
	// When a style rule contains both declarations and nested style rules or nested conditional group rules,
	// all three can be arbitrarily mixed.
	// However, the relative order of declarations vs other rules is not preserved in any way.
	//
	// For the purpose of determining the Order Of Appearance,
	// nested style rules and nested conditional group rules are considered to come after their parent rule.

	let indexOfLastDeclarationInFirstDeclarationList = -1;

	node.each((child, index) => {
		if (child.type === 'decl') {
			if (indexOfLastDeclarationInFirstDeclarationList === index - 1) {
				indexOfLastDeclarationInFirstDeclarationList = index;
				return;
			}

			child.remove();
			node.insertAfter(indexOfLastDeclarationInFirstDeclarationList, child);
			indexOfLastDeclarationInFirstDeclarationList = node.index(child);
			return;
		}

		if (isMixinAtRule(child)) {
			let prev = child.prev();
			// We assume that
			// - a mixin after declarations will resolve to more declarations
			// - a mixin after rules or at-rules will resolve to more rules or at-rules (except after another mixin)
			while (prev) {
				if ((prev.type === 'rule' || (isNonMixinAtRule(prev)))) {
					return;
				}

				prev = prev.prev();
			}

			if (indexOfLastDeclarationInFirstDeclarationList === index - 1) {
				indexOfLastDeclarationInFirstDeclarationList = index;
				return;
			}

			child.remove();
			node.insertAfter(indexOfLastDeclarationInFirstDeclarationList, child);
			indexOfLastDeclarationInFirstDeclarationList = node.index(child);
			return;
		}

		if (child.type === 'comment') {
			const next = child.next();
			if (next && (next.type === 'comment' || next.type === 'rule' || isNonMixinAtRule(next))) {
				return;
			}

			if (indexOfLastDeclarationInFirstDeclarationList === index - 1) {
				indexOfLastDeclarationInFirstDeclarationList = index;
				return;
			}

			child.remove();
			node.insertAfter(indexOfLastDeclarationInFirstDeclarationList, child);
			indexOfLastDeclarationInFirstDeclarationList = node.index(child);
			return;
		}
	});
}
