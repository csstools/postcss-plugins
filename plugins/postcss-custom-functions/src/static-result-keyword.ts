import type { AtRule } from 'postcss';

const CSS_WIDE_KEYWORDS = new Set(['initial', 'inherit', 'unset', 'revert', 'revert-layer']);

/**
 * When the winning `result` descriptor is a CSS-wide keyword and no conditional
 * rule can change it, the call evaluates to that keyword directly.
 */
export function staticResultKeyword(atRule: AtRule): string | null {
	let conditionalResult = false;
	atRule.walkAtRules((child) => {
		child.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'result') {
				conditionalResult = true;
			}
		});
	});

	if (conditionalResult) {
		return null;
	}

	let value: string | null = null;
	for (const node of atRule.nodes || []) {
		if (node.type === 'decl' && node.prop.toLowerCase() === 'result') {
			value = node.value.trim();
		}
	}

	if (!value) {
		return null;
	}

	if (CSS_WIDE_KEYWORDS.has(value.toLowerCase())) {
		return value;
	}

	return null;
}
