import { isTokenComma } from '@csstools/css-tokenizer';
import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode, walk } from '@csstools/css-parser-algorithms';

const LIGHT_DARK_NAME_REGEX = /^light-dark$/i;

function isComma(componentValue: ComponentValue | null): boolean {
	return isTokenNode(componentValue) && isTokenComma(componentValue.value);
}

export function parseLightDark(componentValue: ComponentValue): [ComponentValue, ComponentValue] | false {
	if (!isFunctionNode(componentValue) || !LIGHT_DARK_NAME_REGEX.test(componentValue.getName())) {
		return false;
	}

	const meaningfulValues = componentValue.value.filter((value) => {
		if (isWhitespaceNode(value) || isCommentNode(value)) {
			return false;
		}

		return true;
	});

	if (meaningfulValues.length !== 3) {
		return false;
	}

	let light = meaningfulValues[0];
	const comma = meaningfulValues[1];
	let dark = meaningfulValues[2];
	if (!light || !comma || !dark) {
		return false;
	}

	if (!isComma(comma)) {
		return false;
	}

	if (isComma(light) || isComma(dark)) {
		return false;
	}

	if (isFunctionNode(light)) {
		const list = [light];
		walk(list, ({ node, parent }, index) => {
			recurseLightDark(node, parent, index, true);
		});

		[light] = list;
	}

	if (isFunctionNode(dark)) {
		const list = [dark];
		walk(list, ({ node, parent }, index) => {
			recurseLightDark(node, parent, index, false);
		});

		[dark] = list;
	}

	return [light, dark];
}

function recurseLightDark(node: ComponentValue, parent: { value: Array<ComponentValue> }, index: number | string, isLight: boolean): void {
	if (typeof index !== 'number') {
		return;
	}

	const lightDark = parseLightDark(node);
	if (!lightDark) {
		return;
	}

	let resolved = lightDark[isLight ? 0 : 1];

	if (isFunctionNode(resolved)) {
		const list = [resolved];
		walk(list, ({ node: nn, parent: pp }, ii) => {
			recurseLightDark(nn, pp, ii, isLight);
		});

		[resolved] = list;
	}

	parent.value[index] = resolved;
}
