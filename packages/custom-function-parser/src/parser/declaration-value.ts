import type { ComponentValue, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { isTokenDelim, isTokenOpenCurly, isTokenSemicolon } from '@csstools/css-tokenizer';

/** Whether a component value list violates `<declaration-value>`. */
export function hasInvalidDeclarationValue(componentValues: Array<ComponentValue>): boolean {
	for (const componentValue of componentValues) {
		if (!isTokenNode(componentValue)) {
			continue;
		}

		if (isTokenSemicolon(componentValue.value)) {
			return true;
		}

		if (isTokenDelim(componentValue.value) && componentValue.value[4].value === '!') {
			return true;
		}
	}

	return false;
}

/** The only meaningful `{}` block in a component value list, or `null`. */
export function singleBracedBlock(componentValues: Array<ComponentValue>): SimpleBlockNode | null {
	let block: SimpleBlockNode | null = null;

	for (const componentValue of componentValues) {
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (block || !isSimpleBlockNode(componentValue) || !isTokenOpenCurly(componentValue.startToken)) {
			return null;
		}

		block = componentValue;
	}

	return block;
}

/** Whether a component value list contains a top-level `{}` block. */
export function containsBracedBlock(componentValues: Array<ComponentValue>): boolean {
	return componentValues.some((componentValue) => {
		return isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken);
	});
}
