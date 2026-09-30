import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';

const IS_VAR_OR_STYLE_FUNCTION_REGEX = /^(?:var|style)$/i;

/**
 * Rewrite `var()`/`style()` references to a mixin parameter to its hygienic (private) name.
 * Used to resolve nested `@apply` arguments at the call site.
 */
export function rewriteArgument(argument: string, scope: { prefix: string, privateProperties: Set<string> }): string {
	if (!argument.includes('--')) {
		return argument;
	}

	const componentValues = parseListOfComponentValues(tokenize({ css: argument }));

	walk(componentValues, (entry) => {
		if (!isFunctionNode(entry.node)) {
			return;
		}

		if (!IS_VAR_OR_STYLE_FUNCTION_REGEX.test(entry.node.getName())) {
			return;
		}

		for (const child of entry.node.value) {
			if (isWhiteSpaceOrCommentNode(child)) {
				continue;
			}

			if (!isTokenNode(child) || !isTokenIdent(child.value) || !child.value[4].value.startsWith('--')) {
				break;
			}

			if (!scope.privateProperties.has(child.value[4].value)) {
				break;
			}

			mutateIdent(child.value, `${scope.prefix}${child.value[4].value}`);
			break;
		}
	});

	return stringify([componentValues]);
}
