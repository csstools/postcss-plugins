import { TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
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
import { solveSin } from './sin';
import { solveCos } from './cos';
import { solveTan } from './tan';
import { solveASin } from './asin';
import { solveACos } from './acos';
import { solveATan } from './atan';
import { solveATan2 } from './atan2';
import { solveExp } from './exp';
import { solveSqrt } from './sqrt';

export const mathFunctions = new Map([
	['abs', abs],
	['acos', acos],
	['asin', asin],
	['atan', atan],
	['atan2', atan2],
	['calc', calc],
	['clamp', clamp],
	['cos', cos],
	['exp', exp],
	['max', max],
	['min', min],
	['mod', mod],
	['rem', rem],
	['round', round],
	['sign', sign],
	['sin', sin],
	['sqrt', sqrt],
	['tan', tan],
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

export function singleNodeSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, a: TokenNode) => Calculation | -1): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(fnNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
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

	return solveFn(fnNode, a);
}

export function twoCommaSeparatedNodesSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, a: TokenNode, b: TokenNode) => Calculation | -1): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(fnNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
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

	return solveFn(fnNode, a, b);
}

export function variadicNodesSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, x: Array<ComponentValue>) => Calculation | -1): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(fnNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
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

	return solveFn(fnNode, solvedNodes);
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
	return variadicNodesSolver(maxNode, globals, solveMax);
}

export function min(minNode: FunctionNode, globals: Globals): Calculation | -1 {
	return variadicNodesSolver(minNode, globals, solveMin);
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

export function mod(modNode: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(modNode, globals, solveMod);
}

export function rem(remNode: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(remNode, globals, solveRem);
}

export function abs(absNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(absNode, globals, solveAbs);
}

export function sign(signNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(signNode, globals, solveSign);
}

export function sin(sinNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(sinNode, globals, solveSin);
}

export function cos(codNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(codNode, globals, solveCos);
}

export function tan(tanNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(tanNode, globals, solveTan);
}

export function asin(asinNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(asinNode, globals, solveASin);
}

export function acos(acosNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(acosNode, globals, solveACos);
}

export function atan(atanNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(atanNode, globals, solveATan);
}

export function atan2(atan2Node: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(atan2Node, globals, solveATan2);
}

export function exp(expNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(expNode, globals, solveExp);
}

export function sqrt(sqrtNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(sqrtNode, globals, solveSqrt);
}
