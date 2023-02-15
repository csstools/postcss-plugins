import { TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { Calculation, isCalculation, solve } from '../calculation';
import { unary } from '../operation/unary';
import { multiplication } from '../operation/multiplication';
import { division } from '../operation/division';
import { addition } from '../operation/addition';
import { subtraction } from '../operation/subtraction';
import { solveMin } from './min';
import { solveMax } from './max';
import { solveClamp } from './clamp';
import { Globals } from '../util/globals';
import { resolveGlobalsAndConstants } from './globals-and-constants';
import { solveRound } from './round';
import { solveMod } from './mod';
import { solveRem } from './rem';
import { solveAbs } from './abs';
import { solveSign } from './sign';

const mathFunctions = new Map([
	['abs', abs],
	['calc', calc],
	['clamp', clamp],
	['max', max],
	['min', min],
	['mod', mod],
	['rem', rem],
	['round', round],
	['sign', sign],
]);

export function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue | Calculation> = resolveGlobalsAndConstants(
		[...(calcNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

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
			const mathFunction = mathFunctions.get(child.getName().toLowerCase());
			if (mathFunction) {
				const subCalc = mathFunction(child, globals);
				if (subCalc === -1) {
					return -1;
				}
				nodes.splice(i, 1, subCalc);
			} else {
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

export function clamp(clampNode: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(clampNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

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

	return solveClamp(clampNode, minimum, central, maximum);
}

export function max(maxNode: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(maxNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

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
			if (chunks[i].length === 0) {
				return -1;
			}

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

	return solveMax(maxNode, solvedNodes);
}

export function min(minNode: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(minNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

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
			if (chunks[i].length === 0) {
				return -1;
			}

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

	return solveMin(minNode, solvedNodes);
}

const roundingStrategies = new Set([
	'nearest',
	'up',
	'down',
	'to-zero',
]);

export function round(roundNode: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(roundNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	let roundingStrategy = '';
	const aValue: Array<ComponentValue> = [];
	const bValue: Array<ComponentValue> = [];

	{
		let focus = aValue;

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (!roundingStrategy && aValue.length === 0 && bValue.length === 0 && isTokenNode(node) && node.value[0] === TokenType.Ident) {
				const token = node.value;
				if (roundingStrategies.has(token[4].value.toLowerCase())) {
					roundingStrategy = token[4].value.toLowerCase();
					continue;
				}
			}

			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				if (focus === bValue) {
					return -1;
				}

				if (focus === aValue && roundingStrategy && aValue.length === 0) {
					continue;
				}

				if (focus === aValue) {
					focus = bValue;
					continue;
				}

				return -1;
			}

			focus.push(node);
		}
	}

	const a = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		aValue,
	), globals));

	if (a === -1) {
		return -1;
	}

	const b = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		bValue,
	), globals));

	if (b === -1) {
		return -1;
	}

	if (!roundingStrategy) {
		roundingStrategy = 'nearest';
	}

	return solveRound(roundNode, roundingStrategy, a, b);
}

export function mod(modNodes: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(modNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	const aValue: Array<ComponentValue> = [];
	const bValue: Array<ComponentValue> = [];

	{
		let focus = aValue;

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				if (focus === bValue) {
					return -1;
				}

				if (focus === aValue) {
					focus = bValue;
					continue;
				}

				return -1;
			}

			focus.push(node);
		}
	}

	const a = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		aValue,
	), globals));

	if (a === -1) {
		return -1;
	}

	const b = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		bValue,
	), globals));

	if (b === -1) {
		return -1;
	}

	return solveMod(modNodes, a, b);
}

export function rem(remNodes: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(remNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	const aValue: Array<ComponentValue> = [];
	const bValue: Array<ComponentValue> = [];

	{
		let focus = aValue;

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];

			if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
				if (focus === bValue) {
					return -1;
				}

				if (focus === aValue) {
					focus = bValue;
					continue;
				}

				return -1;
			}

			focus.push(node);
		}
	}

	const a = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		aValue,
	), globals));

	if (a === -1) {
		return -1;
	}

	const b = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		bValue,
	), globals));

	if (b === -1) {
		return -1;
	}

	return solveRem(remNodes, a, b);
}

export function abs(absNodes: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(absNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	const a = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		nodes,
	), globals));

	if (a === -1) {
		return -1;
	}

	return solveAbs(absNodes, a);
}

export function sign(signNodes: FunctionNode, globals: Globals): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(signNodes.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	const a = solve(calc(new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		nodes,
	), globals));

	if (a === -1) {
		return -1;
	}

	return solveSign(signNodes, a);
}
