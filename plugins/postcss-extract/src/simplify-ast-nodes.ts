import type { AtRule, Comment, Declaration, Node, Rule } from 'postcss';

export function simplifyASTNode(node: Node): Record<string, unknown> {
	switch (node.type) {
		case 'decl': {
			const decl = node as Declaration;
			return cleanUndefinedValues({
				type: decl.type,
				important: decl.important,
				prop: decl.prop,
				value: decl.value,
				variable: decl.variable,
			});
		}
		case 'rule': {
			const rule = node as Rule;
			return cleanUndefinedValues({
				type: rule.type,
				selectors: rule.selectors,
			});
		}
		case 'atrule': {
			const atrule = node as AtRule;
			return cleanUndefinedValues({
				type: atrule.type,
				name: atrule.name,
				params: atrule.params,
			});
		}
		case 'comment': {
			const comment = node as Comment;
			return cleanUndefinedValues({
				type: comment.type,
				text: comment.text,
			});
		}
		default:
			return {};
	}
}

function cleanUndefinedValues(object: Record<string, unknown>) {
	Object.keys(object).forEach((key) => {
		if (typeof object[key] === 'undefined') {
			delete object[key];
		}
	});

	return object;
}
