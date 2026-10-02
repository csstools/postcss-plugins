import type { AtRule, Declaration, Document } from 'postcss';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode, walk } from '@csstools/css-parser-algorithms';
import { isTokenIdent, isTokenWhiteSpaceOrComment } from '@csstools/css-tokenizer';

/**
 * Map of wide gamut color function names to the `@supports (color: …)` condition
 * that is required to use the resulting color function.
 *
 * Values that are only known after inspecting the first argument of `color()` are
 * handled separately.
 */
const CONDITION_BY_FUNCTION_NAME = new Map<string, string>([
	['lab', '(color: lab(0% 0 0%))'],
	['lch', '(color: lab(0% 0 0%))'],
	['oklab', '(color: oklab(0% 0 0%))'],
	['oklch', '(color: oklab(0% 0 0%))'],
]);

function colorCondition(colorSpace: string | undefined): string {
	switch (colorSpace) {
		case 'display-p3':
		case 'srgb':
			return '(color: color(display-p3 0 0 0%))';
		case 'display-p3-linear':
			return '(color: color(display-p3-linear 0 0 0))';
		default:
			return '(color: color(xyz 0 0 0%))';
	}
}

function firstColorSpace(functionNode: FunctionNode): string | undefined {
	for (let i = 0; i < functionNode.value.length; i++) {
		const child = functionNode.value[i];

		if (isTokenNode(child) && isTokenWhiteSpaceOrComment(child.value)) {
			continue;
		}

		if (isTokenNode(child) && isTokenIdent(child.value)) {
			return child.value[4].value.toLowerCase();
		}

		return;
	}
}

/**
 * Derive the `@supports (color: …)` conditions for the wide gamut color functions
 * that are used in a list of component values.
 *
 * @param {Array<ComponentValue>} componentValues - The component values to inspect.
 * @returns {Array<string>} The required `@supports` conditions.
 */
export function supportsConditions(componentValues: Array<ComponentValue>): Array<string> {
	const conditions = new Set<string>();

	walk(componentValues, ({ node }) => {
		if (!isFunctionNode(node)) {
			return;
		}

		const name = node.getName().toLowerCase();

		if (name === 'color') {
			conditions.add(colorCondition(firstColorSpace(node)));
			return;
		}

		const condition = CONDITION_BY_FUNCTION_NAME.get(name);
		if (condition) {
			conditions.add(condition);
		}
	});

	return Array.from(conditions).sort();
}

const HAS_COLOR_FEATURE_QUERY_REGEX = /(?:^|[\s(])color\s*:/i;

/**
 * Check if a declaration is already guarded by an `@supports` ancestor.
 *
 * Any `@supports` query that contains a `color:` feature query is considered
 * to cover the color functions used by the declaration.
 *
 * @param {Declaration} decl - The declaration to check.
 * @returns {boolean} `true` if a matching `@supports` ancestor exists.
 */
export function hasSupportsConditionAncestor(decl: Declaration): boolean {
	let parent: typeof decl.parent | Document = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'supports') {
			if (HAS_COLOR_FEATURE_QUERY_REGEX.test((parent as AtRule).params)) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
