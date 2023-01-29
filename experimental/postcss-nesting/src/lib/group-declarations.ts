import type { ChildNode, Container } from 'postcss';

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
			if (indexOfLastDeclarationInFirstDeclarationList === -1) {
				indexOfLastDeclarationInFirstDeclarationList = index;
				return;
			}

			if (indexOfLastDeclarationInFirstDeclarationList === index - 1) {
				indexOfLastDeclarationInFirstDeclarationList = index;
				return;
			}

			child.remove();
			node.insertAfter(indexOfLastDeclarationInFirstDeclarationList, child);
			indexOfLastDeclarationInFirstDeclarationList = node.index(child);
		}
	});
}
