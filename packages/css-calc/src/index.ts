import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, parseComponentValue, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { Calculation, isCalculation, solve } from './calculation';
import { unary } from './operation/unary';
import { multiplication } from './operation/multiplication';
import { division } from './operation/division';
import { addition } from './operation/addition';
import { subtraction } from './operation/subtraction';

export function convert(css: string, callback) {
	const t = tokenizer({
		css: css,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const options = {
		onParseError: ((err) => {
			throw err;
		}),
	};

	const result = parseComponentValue(tokens, options);
	if (!('walk' in result)) {
		return;
	}

	if (isFunctionNode(result) && result.getName().toLowerCase() === 'calc') {
		const calculation = calcHandler(result);
		if (calculation !== -1) {
			console.log(solve(calculation));
		}
	}

	result.walk((entry) => {
		const node = entry.node;
		if (!isFunctionNode(node) || node.getName().toLowerCase() !== 'calc') {
			return;
		}
	});
}

function calcHandler(calcNode: FunctionNode | SimpleBlockNode): Calculation | -1 {
	const nodes: Array<ComponentValue|Calculation> = [...(calcNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))];
	if (nodes.length === 1 && isTokenNode(nodes[0])) {
		return {
			inputs: [nodes[0]],
			operation: unary,
		};
	}

	for (let i = 0; i < nodes.length; i++) {
		const child = nodes[i];
		if (isSimpleBlockNode(child) && child.startToken[0] === TokenType.OpenParen) {
			const subCalc = calcHandler(child);
			if (subCalc === -1) {
				return -1;
			}
			nodes.splice(i, 1, subCalc);
			continue;
		}

		if (isFunctionNode(child)) {
			switch (child.getName().toLowerCase()) {
				case 'calc': {
					const subCalc = calcHandler(child);
					if (subCalc === -1) {
						return -1;
					}
					nodes.splice(i, 1, subCalc);
					break;
				}

				default:
					// TODO : implement other math functions
					return -1;
			}

			continue;
		}
	}

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	for (let i = 0; i < nodes.length; i++) {
		const firstInput = nodes[i];
		if (!firstInput || (!isTokenNode(firstInput) && !isCalculation(firstInput))) {
			return -1;
		}

		const operator = nodes[i + 1];
		if (!operator) {
			break;
		}

		if (!isTokenNode(operator)) {
			return -1;
		}

		const secondInput = nodes[i + 2];
		if (!secondInput || (!isTokenNode(secondInput) && !isCalculation(secondInput))) {
			return -1;
		}

		const token = operator.value;
		if (token[0] === TokenType.Delim && token[4].value === '*') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: multiplication,
			});
			i--;

			continue;
		}

		if (token[0] === TokenType.Delim && token[4].value === '/') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: division,
			});
			i--;

			continue;
		}
	}

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	for (let i = 0; i < nodes.length; i++) {
		const firstInput = nodes[i];
		if (!firstInput || (!isTokenNode(firstInput) && !isCalculation(firstInput))) {
			return -1;
		}

		const operator = nodes[i + 1];
		if (!operator) {
			break;
		}

		if (!isTokenNode(operator)) {
			return -1;
		}

		const secondInput = nodes[i + 2];
		if (!secondInput || (!isTokenNode(secondInput) && !isCalculation(secondInput))) {
			return -1;
		}

		const token = operator.value;
		if (token[0] === TokenType.Delim && token[4].value === '+') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: addition,
			});
			i--;

			continue;
		}

		if (token[0] === TokenType.Delim && token[4].value === '-') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: subtraction,
			});
			i--;

			continue;
		}
	}

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	return -1;
}
