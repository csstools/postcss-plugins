import { NumberType, TokenDimension, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation, isCalculation, solve } from '../calculation';
import { unary } from '../operation/unary';
import { multiplication } from '../operation/multiplication';
import { division } from '../operation/division';
import { addition } from '../operation/addition';
import { subtraction } from '../operation/subtraction';

export function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Map<string, number>): Calculation | -1 {
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
					value: Math.E,
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

	let i = 0;

	while (i < nodes.length) {
		const child = nodes[i];
		if (isSimpleBlockNode(child) && child.startToken[0] === TokenType.OpenParen) {
			const subCalc = calc(child, globals);
			if (subCalc === -1) {
				return -1;
			}
			nodes.splice(i, 1, subCalc);
			continue;
		}

		if (isFunctionNode(child)) {
			switch (child.getName().toLowerCase()) {
				case 'calc': {
					const subCalc = calc(child, globals);
					if (subCalc === -1) {
						return -1;
					}
					nodes.splice(i, 1, subCalc);
					break;
				}

				case 'clamp': {
					const subCalc = clamp(child, globals);
					if (subCalc === -1) {
						return -1;
					}
					nodes.splice(i, 1, subCalc);
					break;
				}

				case 'min': {
					const subCalc = min(child, globals);
					if (subCalc === -1) {
						return -1;
					}
					nodes.splice(i, 1, subCalc);
					break;
				}

				case 'max': {
					const subCalc = max(child, globals);
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

		i++;
	}

	i = 0;

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	while (i < nodes.length) {
		const firstInput = nodes[i];
		if (!firstInput || (!isTokenNode(firstInput) && !isCalculation(firstInput))) {
			i++;
			continue;
		}

		const operator = nodes[i + 1];
		if (!operator || !isTokenNode(operator)) {
			i++;
			continue;
		}

		const token = operator.value;
		if (token[0] !== TokenType.Delim || !(token[4].value === '*' || token[4].value === '/')) {
			i++;
			continue;
		}

		const secondInput = nodes[i + 2];
		if (!secondInput || (!isTokenNode(secondInput) && !isCalculation(secondInput))) {
			return -1;
		}

		if (token[4].value === '*') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: multiplication,
			});

			continue;
		}

		if (token[4].value === '/') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: division,
			});

			continue;
		}

		i++;
		continue;
	}

	i = 0;

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	while (i < nodes.length) {
		const firstInput = nodes[i];
		if (!firstInput || (!isTokenNode(firstInput) && !isCalculation(firstInput))) {
			i++;
			continue;
		}

		const operator = nodes[i + 1];
		if (!operator || !isTokenNode(operator)) {
			i++;
			continue;
		}

		const token = operator.value;
		if (token[0] !== TokenType.Delim || !(token[4].value === '+' || token[4].value === '-')) {
			i++;
			continue;
		}

		const secondInput = nodes[i + 2];
		if (!secondInput || (!isTokenNode(secondInput) && !isCalculation(secondInput))) {
			return -1;
		}

		if (token[4].value === '+') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: addition,
			});

			continue;
		}

		if (token[4].value === '-') {
			nodes.splice(i, 3, {
				inputs: [firstInput, secondInput],
				operation: subtraction,
			});

			continue;
		}

		i++;
		continue;
	}

	if (nodes.length === 1 && isCalculation(nodes[0])) {
		return nodes[0];
	}

	return -1;
}

export function clamp(clampNode: FunctionNode, globals: Map<string, number>): Calculation | -1 {
	const nodes: Array<ComponentValue> = [...(clampNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))];

	const minimumValue: Array<ComponentValue> = [];
	const centralValue: Array<ComponentValue> = [];
	const maximumValue: Array<ComponentValue> = [];

	{
		let focus = minimumValue;

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				if (focus === maximumValue) {
					return -1;
				}

				if (focus === centralValue) {
					focus = maximumValue;
					continue;
				}

				if (focus === minimumValue) {
					focus = centralValue;
					continue;
				}

				return -1;
			}

			focus.push(node);
		}
	}

	const minimum = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		minimumValue,
	), globals));

	if (minimum === -1) {
		return -1;
	}

	const central = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		centralValue,
	), globals));

	if (central === -1) {
		return -1;
	}

	const maximum = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		maximumValue,
	), globals));

	if (maximum === -1) {
		return -1;
	}

	if (
		!isTokenNode(minimum) ||
		!isTokenNode(central) ||
		!isTokenNode(maximum)
	) {
		return -1;
	}

	const minimumToken = minimum.value;
	const centralToken = central.value;
	const maximumToken = maximum.value;

	if (
		!(
			minimumToken[0] === TokenType.Dimension ||
			minimumToken[0] === TokenType.Number ||
			minimumToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	if (minimumToken[0] !== centralToken[0]) {
		return -1;
	}

	if (minimumToken[0] !== maximumToken[0]) {
		return -1;
	}

	if (minimumToken[0] === TokenType.Dimension) {
		if (minimumToken[4].unit.toLowerCase() !== (centralToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}

		if (minimumToken[4].unit.toLowerCase() !== (maximumToken as TokenDimension)[4].unit.toLowerCase()) {
			return -1;
		}
	}

	const result = Math.max(minimumToken[4].value, Math.min(centralToken[4].value, maximumToken[4].value));
	const clampTokens = clampNode.tokens();

	if (minimumToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + minimumToken[4].unit,
						clampTokens[0][2],
						clampTokens[clampTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: minimumToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (minimumToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						clampTokens[0][2],
						clampTokens[clampTokens.length - 1][3],
						{
							value: result,
						},
					],
				),
			],
			operation: unary,
		};
	}

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					clampTokens[0][2],
					clampTokens[clampTokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
					},
				],
			),
		],
		operation: unary,
	};
}

export function max(maxNodes: FunctionNode, globals: Map<string, number>): Calculation | -1 {
	const nodes: Array<ComponentValue> = [...(maxNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))];

	const solvedNodes: Array<ComponentValue> = [];

	{
		const chunks = [];
		let chunk = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				chunks.push(chunk);
				chunk = [];
				continue;
			}

			chunk.push(node);
		}

		chunks.push(chunk);

		for (let i = 0; i < chunks.length; i++) {
			const solvedChunk = solve(calc(new FunctionNode(
				[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				chunks[i],
			), globals));
			if (solvedChunk === -1) {
				return -1;
			}

			solvedNodes.push(solvedChunk);
		}
	}

	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = solvedNodes[0].value;
	if (
		!(
			firstSolvedToken[0] === TokenType.Dimension ||
			firstSolvedToken[0] === TokenType.Number ||
			firstSolvedToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const tokenTypes = new Set(solvedNodes.map((x) => (x as TokenNode).value[0]));
	if (tokenTypes.size !== 1) {
		return -1;
	}

	const units = new Set(solvedNodes.map((x) => ((x as TokenNode).value[4]['unit'] ?? '').toLowerCase()));
	if (units.size !== 1) {
		return -1;
	}

	const values = solvedNodes.map((x) => ((x as TokenNode).value as TokenDimension | TokenNumber | TokenPercentage)[4].value);

	const result = Math.max(...values);
	const maxTokens = maxNodes.tokens();

	if (firstSolvedToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + firstSolvedToken[4].unit,
						maxTokens[0][2],
						maxTokens[maxTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: firstSolvedToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (firstSolvedToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						maxTokens[0][2],
						maxTokens[maxTokens.length - 1][3],
						{
							value: result,
						},
					],
				),
			],
			operation: unary,
		};
	}

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					maxTokens[0][2],
					maxTokens[maxTokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
					},
				],
			),
		],
		operation: unary,
	};
}

export function min(minNodes: FunctionNode, globals: Map<string, number>): Calculation | -1 {
	const nodes: Array<ComponentValue> = [...(minNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))];

	const solvedNodes: Array<ComponentValue> = [];

	{
		const chunks = [];
		let chunk = [];
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				chunks.push(chunk);
				chunk = [];
				continue;
			}

			chunk.push(node);
		}

		chunks.push(chunk);

		for (let i = 0; i < chunks.length; i++) {
			const solvedChunk = solve(calc(new FunctionNode(
				[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				chunks[i],
			), globals));
			if (solvedChunk === -1) {
				return -1;
			}

			solvedNodes.push(solvedChunk);
		}
	}

	const firstSolvedNode = solvedNodes[0];
	if (!firstSolvedNode || !isTokenNode(firstSolvedNode)) {
		return -1;
	}

	const componentTypes = new Set(solvedNodes.map((x) => x.type));
	if (componentTypes.size !== 1) {
		return -1;
	}

	const firstSolvedToken = solvedNodes[0].value;
	if (
		!(
			firstSolvedToken[0] === TokenType.Dimension ||
			firstSolvedToken[0] === TokenType.Number ||
			firstSolvedToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const tokenTypes = new Set(solvedNodes.map((x) => (x as TokenNode).value[0]));
	if (tokenTypes.size !== 1) {
		return -1;
	}

	const units = new Set(solvedNodes.map((x) => ((x as TokenNode).value[4]['unit'] ?? '').toLowerCase()));
	if (units.size !== 1) {
		return -1;
	}

	const values = solvedNodes.map((x) => ((x as TokenNode).value as TokenDimension | TokenNumber | TokenPercentage)[4].value);

	const result = Math.min(...values);
	const minTokens = minNodes.tokens();

	if (firstSolvedToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + firstSolvedToken[4].unit,
						minTokens[0][2],
						minTokens[minTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: firstSolvedToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (firstSolvedToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						minTokens[0][2],
						minTokens[minTokens.length - 1][3],
						{
							value: result,
						},
					],
				),
			],
			operation: unary,
		};
	}

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					minTokens[0][2],
					minTokens[minTokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
					},
				],
			),
		],
		operation: unary,
	};
}
