import { NumberType, tokenizer, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, parseComponentValue, SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation, isCalculation, solve } from './calculation';
import { unary } from './operation/unary';
import { multiplication } from './operation/multiplication';
import { division } from './operation/division';
import { addition } from './operation/addition';
import { subtraction } from './operation/subtraction';

export function convert(css: string, globals?: Map<string, number>) {
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
		const calculation = calcHandler(result, globals ?? new Map());
		if (calculation === -1) {
			return css;
		}

		const calcResult = solve(calculation);
		if (calcResult === -1) {
			return css;
		}

		return calcResult.toString();
	}

	result.walk((entry, index) => {
		if (typeof index !== 'number') {
			return;
		}

		const node = entry.node;
		if (!isFunctionNode(node) || node.getName().toLowerCase() !== 'calc') {
			return;
		}

		const calculation = calcHandler(node, globals ?? new Map());
		if (calculation === -1) {
			return;
		}

		const calcResult = solve(calculation);
		if (calcResult === -1) {
			return;
		}

		entry.parent.value.splice(index, 1, calcResult);
	});

	return result.toString();
}

function calcHandler(calcNode: FunctionNode | SimpleBlockNode, globals: Map<string, number>): Calculation | -1 {
	const nodes: Array<ComponentValue | Calculation> = [...(calcNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!isTokenNode(node)) {
			continue;
		}

		const token = node.value;
		if (token[0] !== TokenType.Ident) {
			continue;
		}

		const ident = token[4].value.toLowerCase();
		switch (ident) {
			case 'e':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, Math.E.toString(), token[2], token[3], {
					value:Math.E,
					type: NumberType.Number,
				}]));
				break;
			case 'pi':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, Math.PI.toString(), token[2], token[3], {
					value: Math.PI,
					type: NumberType.Number,
				}]));
				break;

			default:
				if (globals.has(ident)) {
					const replacement = globals.get(ident);
					nodes.splice(i, 1, new TokenNode([TokenType.Number, replacement.toString(), token[2], token[3], {
						value: replacement,
						type: NumberType.Number,
					}]));
				}
				break;
		}
	}

	if (nodes.length === 1 && isTokenNode(nodes[0])) {
		return {
			inputs: [nodes[0]],
			operation: unary,
		};
	}

	for (let i = 0; i < nodes.length; i++) {
		const child = nodes[i];
		if (isSimpleBlockNode(child) && child.startToken[0] === TokenType.OpenParen) {
			const subCalc = calcHandler(child, globals);
			if (subCalc === -1) {
				return -1;
			}
			nodes.splice(i, 1, subCalc);
			continue;
		}

		if (isFunctionNode(child)) {
			switch (child.getName().toLowerCase()) {
				case 'calc': {
					const subCalc = calcHandler(child, globals);
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
