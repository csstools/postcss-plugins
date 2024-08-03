import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent } from '@csstools/css-tokenizer';

const CONTRAST_COLOR_NAME_REGEX = /^contrast-color$/i;

export function parseContrastColor(componentValue: ComponentValue): [ComponentValue, 'max'?] | false {
	if (!isFunctionNode(componentValue) || !CONTRAST_COLOR_NAME_REGEX.test(componentValue.getName())) {
		return false;
	}

	const meaningfulValues = componentValue.value.filter((value) => {
		if (isWhitespaceNode(value) || isCommentNode(value)) {
			return false;
		}

		return true;
	});

	if (meaningfulValues.length > 2) {
		return false;
	}

	const color = meaningfulValues[0];
	const modifier: ComponentValue | undefined = meaningfulValues[1];
	if (!color) {
		return false;
	}

	if (!modifier) {
		return [color];
	}

	if (
		!isTokenNode(modifier) ||
		!isTokenIdent(modifier.value) ||
		modifier.value[4].value.toLowerCase() !== 'max'
	) {
		return false;
	}

	return [color, 'max'];
}
