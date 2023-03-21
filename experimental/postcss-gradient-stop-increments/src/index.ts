import { ComponentValue, TokenNode } from '@csstools/css-parser-algorithms';
import type { PluginCreator } from 'postcss';
import { FunctionNode, isCommentNode, isTokenNode, WhitespaceNode, isFunctionNode, isSimpleBlockNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { calcFromComponentValues } from '@csstools/css-calc';
import { NumberType, stringify as stringifyTokens } from '@csstools/css-tokenizer';
import { tokenize, TokenType } from '@csstools/css-tokenizer';

/** postcss-gradient-stop-increments plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const gradientFunctionRegex = /(repeating-)?(linear|radial|conic)-gradient\(/i;
const gradientNameRegex = /^(repeating-)?(linear|radial|conic)-gradient$/i;
const mathFunctionNameRegex = /^(abs|acos|asin|atan|atan2|calc|clamp|cos|exp|hypot|log|max|min|mod|pow|rem|round|sign|sin|sqrt|tan)$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-gradient-stop-increments',
		Declaration(decl) {
			if (!gradientFunctionRegex.test(decl.value)) {
				return;
			}

			const tokens = tokenize({
				css: decl.value,
			});
			if (!tokens.find((token) => token[0] === TokenType.Delim && token[4].value === '+')) {
				return;
			}

			const modified = stringify(replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({
					css: decl.value,
				})),
				(componentValue) => {
					if (!isFunctionNode(componentValue)) {
						return;
					}

					const functionName = componentValue.getName();
					if (!gradientNameRegex.test(functionName)) {
						return;
					}

					let lastLengthNode: ComponentValue | null = null;
					for (let i = 0; i < componentValue.value.length; i++) {
						const node = componentValue.value[i];

						if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '+') {
							const operatorNode = node;
							const operatorIndex = i;

							while (isCommentNode(componentValue.value[i + 1])) {
								i++;
							}
							i++;

							if (isZeroOrNegative(componentValue.value[i])) {
								const zeroNode = new TokenNode([TokenType.Number, '0', -1, -1, { value: 0, type: NumberType.Integer }]);
								componentValue.value.splice(operatorIndex, (i - operatorIndex + 1), zeroNode);

								i = componentValue.value.indexOf(zeroNode);
								continue;
							}

							const nextNode = incrementLengthNode(lastLengthNode, operatorNode, componentValue.value[i]);
							componentValue.value.splice(operatorIndex, (i - operatorIndex + 1), nextNode);
							lastLengthNode = nextNode;

							i = componentValue.value.indexOf(nextNode);
							continue;
						}

						if (isNumericLargerThanZero(node)) {
							lastLengthNode = maxOfLastAndCurrentLengthNode(lastLengthNode, node);
							continue;
						}

						if (isFunctionNode(node) && mathFunctionNameRegex.test(node.getName())) {
							lastLengthNode = maxOfLastAndCurrentLengthNode(lastLengthNode, node);
							continue;
						}
					}

					return;
				},
			));

			if (modified === decl.value) {
				return;
			}

			decl.cloneBefore({
				value: modified,
			});

			if (!options?.preserve) {
				decl.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

function isNumericLargerThanZero(node: ComponentValue): boolean {
	if (
		isTokenNode(node) &&
		(
			node.value[0] === TokenType.Percentage ||
			node.value[0] === TokenType.Dimension ||
			node.value[0] === TokenType.Number
		) &&
		/*
			Values can only increase.
			For zero specifically we know that it will be smaller and normalized by browsers.
			For all other values we wrap with `max(a, b)`.
		*/
		node.value[4].value > 0
	) {
		return true;
	}

	return false;
}

function isZeroOrNegative(node: ComponentValue): boolean {
	if (
		isTokenNode(node) &&
		(
			node.value[0] === TokenType.Percentage ||
			node.value[0] === TokenType.Dimension ||
			node.value[0] === TokenType.Number
		) &&
		/*
			Values can only increase.
			For zero specifically we know that it will be smaller and normalized by browsers.
			For all other values we wrap with `max(a, b)`.
		*/
		node.value[4].value <= 0
	) {
		return true;
	}

	return false;
}

function incrementLengthNode(lastLengthNode: ComponentValue | null, operatorNode: ComponentValue, nextNode: ComponentValue): ComponentValue {
	if (!lastLengthNode) {
		return nextNode;
	}

	const maxLengthNode = new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			lastLengthNode,
			new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
			operatorNode,
			new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
			nextNode,
		],
	);

	const [[solvedLengthNode]] = calcFromComponentValues([[maxLengthNode]]);

	return solvedLengthNode;
}

function maxOfLastAndCurrentLengthNode(lastLengthNode: ComponentValue | null, newLengthNode: ComponentValue): ComponentValue {
	if (!lastLengthNode) {
		return newLengthNode;
	}

	const maxLengthNode = new FunctionNode(
		[TokenType.Function, 'max(', -1, -1, { value: 'max' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			lastLengthNode,
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
			newLengthNode,
		],
	);

	const [[solvedLengthNode]] = calcFromComponentValues([[maxLengthNode]]);

	return solvedLengthNode;
}

// TODO : this should be in css-parser-algorithms, will be present in an upcoming release
function replaceComponentValues(
	componentValuesList: Array<Array<ComponentValue>>,
	visitor: (componentValue: ComponentValue) => ComponentValue | void,
) {
	for (let i = 0; i < componentValuesList.length; i++) {
		const componentValues = componentValuesList[i];

		for (let j = 0; j < componentValues.length; j++) {
			const componentValue = componentValues[j];

			visitor(componentValue);

			if (isSimpleBlockNode(componentValue) || isFunctionNode(componentValue)) {
				componentValue.walk((entry, index) => {
					if (typeof index !== 'number') {
						return;
					}

					visitor(entry.node);
				});
			}
		}
	}

	return componentValuesList;
}

// TODO : this should be in css-parser-algorithms, will be present in an upcoming release
function stringify(componentValueLists: Array<Array<ComponentValue>>): string {
	return componentValueLists.map((componentValues) => {
		return componentValues.map((x) => stringifyTokens(...x.tokens())).join('');
	}).join(',');
}
