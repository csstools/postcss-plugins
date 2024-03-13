import { isSimpleBlockNode } from '@csstools/css-parser-algorithms';
import { ComponentValue, ComponentValueType, isCommentNode, isTokenNode, isWhitespaceNode, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { GeneralEnclosed } from '../nodes/general-enclosed';
import { MediaAnd } from '../nodes/media-and';
import { MediaCondition } from '../nodes/media-condition';
import { MediaConditionListWithAnd, MediaConditionListWithOr } from '../nodes/media-condition-list';
import { parseMediaFeature } from '../nodes/media-feature';
import { MediaInParens } from '../nodes/media-in-parens';
import { MediaNot } from '../nodes/media-not';
import { MediaOr } from '../nodes/media-or';
import { MediaQuery, MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
import { modifierFromToken } from '../nodes/media-query-modifier';
import { isIdent } from '../util/component-value-is';

export function parseMediaQuery(componentValues: Array<ComponentValue>): MediaQuery | false {
	{
		const condition = parseMediaCondition(componentValues);
		if (condition !== false) {
			return new MediaQueryWithoutType(condition);
		}
	}

	{
		let modifierIndex = -1;
		let typeIndex = -1;
		let andIndex = -1;

		for (let i = 0; i < componentValues.length; i++) {
			const componentValue = componentValues[i] as ComponentValue;
			if (isWhitespaceNode(componentValue)) {
				continue;
			}

			if (isCommentNode(componentValue)) {
				continue;
			}

			if (isTokenNode(componentValue)) {
				const token = componentValue.value;
				if (modifierIndex === -1 && token[0] === TokenType.Ident && modifierFromToken(token)) {
					modifierIndex = i;
					continue;
				}

				if (typeIndex === -1 && token[0] === TokenType.Ident && !modifierFromToken(token)) {
					typeIndex = i;
					continue;
				}

				if (andIndex === -1 && token[0] === TokenType.Ident && IS_AND_REGEX.test(token[4].value)) {
					andIndex = i;
					const condition = parseMediaConditionWithoutOr(componentValues.slice(i+1));
					if (condition === false) {
						return false;
					}

					break;
				}

				return false;
			}

			return false;
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

		const remainder = componentValues.slice(Math.max(modifierIndex, typeIndex, andIndex) + 1);
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
			componentValues.slice(typeIndex + 1, andIndex + 1).flatMap((x) => {
				return x.tokens();
			}),
			condition,
		);
	}
}

function parseMediaConditionListWithOr(componentValues: Array<ComponentValue>): MediaConditionListWithOr | false {
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

		if (leading === false && isSimpleBlockNode(componentValue)) {
			componentValue.normalize();
			leading = parseMediaInParensFromSimpleBlock(componentValue);
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

function parseMediaConditionListWithAnd(componentValues: Array<ComponentValue>): MediaConditionListWithAnd | false {
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

		if (leading === false && isSimpleBlockNode(componentValue)) {
			componentValue.normalize();
			leading = parseMediaInParensFromSimpleBlock(componentValue);
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

function parseMediaCondition(componentValues: Array<ComponentValue>): MediaCondition | false {
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

function parseMediaConditionWithoutOr(componentValues: Array<ComponentValue>): MediaCondition | false {
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

function parseMediaInParens(componentValues: Array<ComponentValue>): MediaInParens | false {
	let singleSimpleBlockIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isSimpleBlockNode(componentValue)) {
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

	simpleBlock.normalize();

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

	const feature = parseMediaFeature(simpleBlock, before, after);
	if (feature !== false) {
		return new MediaInParens(feature);
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

function parseMediaInParensFromSimpleBlock(simpleBlock: SimpleBlockNode): MediaInParens | false {
	if (simpleBlock.startToken[0] !== TokenType.OpenParen) {
		return false;
	}

	const feature = parseMediaFeature(simpleBlock, [simpleBlock.startToken], [simpleBlock.endToken]);
	if (feature !== false) {
		return new MediaInParens(feature);
	}

	const condition = parseMediaCondition(simpleBlock.value);
	if (condition !== false) {
		return new MediaInParens(condition, [simpleBlock.startToken], [simpleBlock.endToken]);
	}

	return new MediaInParens(new GeneralEnclosed(simpleBlock));
}

const IS_NOT_REGEX = /^not$/i;

function parseMediaNot(componentValues: Array<ComponentValue>): MediaNot | false {
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
			if (IS_NOT_REGEX.test(token[4].value)) {
				if (sawNot) {
					return false;
				}

				sawNot = true;
				continue;
			}

			return false;
		}

		if (sawNot && isSimpleBlockNode(componentValue)) {
			componentValue.normalize();
			const media = parseMediaInParensFromSimpleBlock(componentValue);
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

const IS_OR_REGEX = /^or$/i;

function parseMediaOr(componentValues: Array<ComponentValue>): { advance: number, node: MediaOr } | false {
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
			if (IS_OR_REGEX.test(token[4].value)) {
				if (sawOr) {
					return false;
				}

				sawOr = true;
				continue;
			}

			return false;
		}

		if (sawOr && isSimpleBlockNode(componentValue)) {
			componentValue.normalize();
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

const IS_AND_REGEX = /^and$/i;

function parseMediaAnd(componentValues: Array<ComponentValue>): { advance: number, node: MediaAnd } | false {
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
			if (IS_AND_REGEX.test(token[4].value)) {
				if (sawAnd) {
					return false;
				}

				sawAnd = true;
				continue;
			}

			return false;
		}

		if (sawAnd && isSimpleBlockNode(componentValue)) {
			componentValue.normalize();
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
