import { ComponentValue, ComponentValueType, SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { GeneralEnclosed } from '../nodes/general-enclosed';
import { MediaAnd } from '../nodes/media-and';
import { MediaCondition } from '../nodes/media-condition';
import { MediaConditionListWithAnd, MediaConditionListWithOr } from '../nodes/media-condition-list';
import { parseMediaFeature } from '../nodes/media-feature';
import { MediaInParens } from '../nodes/media-in-parens';
import { MediaNot } from '../nodes/media-not';
import { MediaOr } from '../nodes/media-or';
import { MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
import { modifierFromToken } from '../nodes/media-query-modifier';
import { isIdent } from '../util/component-value-is';

export function parseMediaQuery(componentValues: Array<ComponentValue>) {
	{
		const condition = parseMediaCondition(componentValues);
		if (condition !== false) {
			return new MediaQueryWithoutType(condition);
		}
	}

	{
		let modifierIndex = -1;
		let typeIndex = -1;

		for (let i = 0; i < componentValues.length; i++) {
			const componentValue = componentValues[i];
			if (componentValue.type === ComponentValueType.Whitespace) {
				continue;
			}

			if (componentValue.type === ComponentValueType.Comment) {
				continue;
			}

			if (componentValue.type === ComponentValueType.Token) {
				const token = (componentValue as TokenNode).value;
				if (token[0] === TokenType.Ident && modifierFromToken(token)) {
					modifierIndex = i;
					continue;
				}

				if (token[0] === TokenType.Ident) {
					typeIndex = i;
					continue;
				}

				return false;
			}

			const condition = parseMediaConditionWithoutOr(componentValues.slice(i));
			if (condition === false) {
				return false;
			}
		}

		let modifierTokens: Array<CSSToken> = [];
		let typeTokens: Array<CSSToken> = [];

		if (modifierIndex !== -1) {
			modifierTokens = componentValues.slice(0, modifierIndex + 1).flatMap((x) => {
				return x.tokens();
			});

			if (typeIndex !== -1) {
				typeTokens = componentValues.slice(modifierIndex + 1, typeIndex + 1).flatMap((x) => {
					return x.tokens();
				});
			}
		} else if (typeIndex !== -1) {
			typeTokens = componentValues.slice(0, typeIndex + 1).flatMap((x) => {
				return x.tokens();
			});
		}

		const remainder = componentValues.slice(Math.max(modifierIndex, typeIndex) + 1);
		const condition = parseMediaConditionWithoutOr(remainder);
		if (condition === false) {
			return new MediaQueryWithType(
				modifierTokens,
				[
					...typeTokens,
					...componentValues.slice(typeIndex + 1).flatMap((x) => {
						return x.tokens();
					}),
				],
			);
		}

		return new MediaQueryWithType(
			modifierTokens,
			typeTokens,
			condition,
		);
	}
}

export function parseMediaConditionListWithOr(componentValues: Array<ComponentValue>) {
	let leading: MediaInParens | false = false;
	const list: Array<MediaOr> = [];
	let firstIndex = -1;
	let lastIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		if (leading) {
			const part = parseMediaOr(componentValues.slice(i));
			if (part !== false) {
				i += part.advance;
				list.push(part.node);
				lastIndex = i;
				continue;
			}
		}

		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (leading) {
			return false;
		}

		if (leading === false && componentValue.type === ComponentValueType.SimpleBlock) {
			leading = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (leading === false) {
				return false;
			}

			firstIndex = i;
			continue;
		}

		return false;
	}

	if (leading && list.length) {
		return new MediaConditionListWithOr(
			leading,
			list,
			componentValues.slice(0, firstIndex).flatMap((x) => {
				return x.tokens();
			}),
			componentValues.slice(lastIndex + 1).flatMap((x) => {
				return x.tokens();
			}),
		);
	}

	return false;
}

export function parseMediaConditionListWithAnd(componentValues: Array<ComponentValue>) {
	let leading: MediaInParens | false = false;
	const list: Array<MediaAnd> = [];
	let firstIndex = -1;
	let lastIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		if (leading) {
			const part = parseMediaAnd(componentValues.slice(i));
			if (part !== false) {
				i += part.advance;
				list.push(part.node);
				lastIndex = i;
				continue;
			}
		}

		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (leading) {
			return false;
		}

		if (leading === false && componentValue.type === ComponentValueType.SimpleBlock) {
			leading = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (leading === false) {
				return false;
			}

			firstIndex = i;
			continue;
		}

		return false;
	}

	if (leading && list.length) {
		return new MediaConditionListWithAnd(
			leading,
			list,
			componentValues.slice(0, firstIndex).flatMap((x) => {
				return x.tokens();
			}),
			componentValues.slice(lastIndex + 1).flatMap((x) => {
				return x.tokens();
			}),
		);
	}

	return false;
}

export function parseMediaCondition(componentValues: Array<ComponentValue>) {
	const mediaNot = parseMediaNot(componentValues);
	if (mediaNot !== false) {
		return new MediaCondition(mediaNot);
	}

	const mediaListAnd = parseMediaConditionListWithAnd(componentValues);
	if (mediaListAnd !== false) {
		return new MediaCondition(mediaListAnd);
	}

	const mediaListOr = parseMediaConditionListWithOr(componentValues);
	if (mediaListOr !== false) {
		return new MediaCondition(mediaListOr);
	}

	const mediaInParens = parseMediaInParens(componentValues);
	if (mediaInParens !== false) {
		return new MediaCondition(mediaInParens);
	}

	return false;
}

export function parseMediaConditionWithoutOr(componentValues: Array<ComponentValue>) {
	const mediaNot = parseMediaNot(componentValues);
	if (mediaNot !== false) {
		return new MediaCondition(mediaNot);
	}

	const mediaListAnd = parseMediaConditionListWithAnd(componentValues);
	if (mediaListAnd !== false) {
		return new MediaCondition(mediaListAnd);
	}

	const mediaInParens = parseMediaInParens(componentValues);
	if (mediaInParens !== false) {
		return new MediaCondition(mediaInParens);
	}

	return false;
}

export function parseMediaInParens(componentValues: Array<ComponentValue>) {
	let singleSimpleBlockIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (componentValue.type === ComponentValueType.SimpleBlock) {
			if (singleSimpleBlockIndex !== -1) {
				return false;
			}

			singleSimpleBlockIndex = i;
			continue;
		}

		return false;
	}

	if (singleSimpleBlockIndex === -1) {
		return false;
	}

	const simpleBlock = componentValues[singleSimpleBlockIndex] as SimpleBlockNode;
	if (simpleBlock.startToken[0] !== TokenType.OpenParen) {
		return false;
	}

	const before = [
		...componentValues.slice(0, singleSimpleBlockIndex).flatMap((x) => {
			return x.tokens();
		}),
		simpleBlock.startToken,
	];

	const after = [
		simpleBlock.endToken,
		...componentValues.slice(singleSimpleBlockIndex + 1).flatMap((x) => {
			return x.tokens();
		}),
	];

	const feature = parseMediaFeature(simpleBlock);
	if (feature !== false) {
		return new MediaInParens(feature, before, after);
	}

	const condition = parseMediaCondition(simpleBlock.value);
	if (condition !== false) {
		return new MediaInParens(condition, before, after);
	}

	return new MediaInParens(
		new GeneralEnclosed(simpleBlock),
		componentValues.slice(0, singleSimpleBlockIndex).flatMap((x) => {
			return x.tokens();
		}),
		componentValues.slice(singleSimpleBlockIndex + 1).flatMap((x) => {
			return x.tokens();
		}),
	);
}

export function parseMediaInParensFromSimpleBlock(simpleBlock: SimpleBlockNode) {
	if (simpleBlock.startToken[0] !== TokenType.OpenParen) {
		return false;
	}

	const feature = parseMediaFeature(simpleBlock);
	if (feature !== false) {
		return new MediaInParens(feature, [simpleBlock.startToken], [simpleBlock.endToken]);
	}

	const condition = parseMediaCondition(simpleBlock.value);
	if (condition !== false) {
		return new MediaInParens(condition, [simpleBlock.startToken], [simpleBlock.endToken]);
	}

	return new MediaInParens(new GeneralEnclosed(simpleBlock));
}

export function parseMediaNot(componentValues: Array<ComponentValue>) {
	let sawNot = false;
	let node: MediaNot | null = null;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isIdent(componentValue)) {
			const token = (componentValue.value as TokenIdent);
			if (token[4].value.toLowerCase() === 'not') {
				if (sawNot) {
					return false;
				}

				sawNot = true;
				continue;
			}

			return false;
		}

		if (sawNot && componentValue.type === ComponentValueType.SimpleBlock) {
			const media = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (media === false) {
				return false;
			}

			node = new MediaNot(
				componentValues.slice(0, i).flatMap((x) => {
					return x.tokens();
				}),
				media,
			);

			continue;
		}

		return false;
	}

	if (node) {
		return node;
	}

	return false;
}

export function parseMediaOr(componentValues: Array<ComponentValue>) {
	let sawOr = false;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isIdent(componentValue)) {
			const token = (componentValue.value as TokenIdent);
			if (token[4].value.toLowerCase() === 'or') {
				if (sawOr) {
					return false;
				}

				sawOr = true;
				continue;
			}

			return false;
		}

		if (sawOr && componentValue.type === ComponentValueType.SimpleBlock) {
			const media = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (media === false) {
				return false;
			}

			return {
				advance: i,
				node: new MediaOr(
					componentValues.slice(0, i).flatMap((x) => {
						return x.tokens();
					}),
					media,
				),
			};
		}

		return false;
	}

	return false;
}

export function parseMediaAnd(componentValues: Array<ComponentValue>) {
	let sawAnd = false;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isIdent(componentValue)) {
			const token = (componentValue.value as TokenIdent);
			if (token[4].value.toLowerCase() === 'and') {
				if (sawAnd) {
					return false;
				}

				sawAnd = true;
				continue;
			}

			return false;
		}

		if (sawAnd && componentValue.type === ComponentValueType.SimpleBlock) {
			const media = parseMediaInParensFromSimpleBlock(componentValue as SimpleBlockNode);
			if (media === false) {
				return false;
			}

			return {
				advance: i,
				node: new MediaAnd(
					componentValues.slice(0, i).flatMap((x) => {
						return x.tokens();
					}),
					media,
				),
			};
		}

		return false;
	}

	return false;
}
