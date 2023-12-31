import type { Calculation } from '../calculation';
import type { ComponentValue, SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
import type { Globals } from '../util/globals';
import { TokenType } from '@csstools/css-tokenizer';
import { addition } from '../operation/addition';
import { division } from '../operation/division';
import { isCalculation, solve } from '../calculation';
import { isCommentNode, FunctionNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { multiplication } from '../operation/multiplication';
import { resolveGlobalsAndConstants } from './globals-and-constants';
import { solveACos } from './acos';
import { solveASin } from './asin';
import { solveATan } from './atan';
import { solveATan2 } from './atan2';
import { solveAbs } from './abs';
import { solveClamp } from './clamp';
import { solveCos } from './cos';
import { solveExp } from './exp';
import { solveHypot } from './hypot';
import { solveMax } from './max';
import { solveMin } from './min';
import { solveMod } from './mod';
import { solvePow } from './pow';
import { solveRem } from './rem';
import { solveRound } from './round';
import { solveSign } from './sign';
import { solveSin } from './sin';
import { solveSqrt } from './sqrt';
import { solveTan } from './tan';
import { subtraction } from '../operation/subtraction';
import { unary } from '../operation/unary';
import { solveLog } from './log';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

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
	['hypot', hypot],
	['log', log],
	['max', max],
	['min', min],
	['mod', mod],
	['pow', pow],
	['rem', rem],
	['round', round],
	['sign', sign],
	['sin', sin],
	['sqrt', sqrt],
	['tan', tan],
]);

function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Globals): Calculation | -1 {
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
			const mathFunction = mathFunctions.get(toLowerCaseAZ(child.getName()));
			if (!mathFunction) {
				return -1;
			}

			const subCalc = mathFunction(child, globals);
			if (subCalc === -1) {
				return -1;
			}
			nodes.splice(i, 1, subCalc);

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

function singleNodeSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, a: TokenNode) => Calculation | -1): Calculation | -1 {
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

function twoCommaSeparatedNodesSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, a: TokenNode, b: TokenNode) => Calculation | -1): Calculation | -1 {
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

function variadicNodesSolver(fnNode: FunctionNode, globals: Globals, solveFn: (node: FunctionNode, x: Array<ComponentValue>) => Calculation | -1): Calculation | -1 {
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

function clamp(clampNode: FunctionNode, globals: Globals): Calculation | -1 {
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

function max(maxNode: FunctionNode, globals: Globals): Calculation | -1 {
	return variadicNodesSolver(maxNode, globals, solveMax);
}

function min(minNode: FunctionNode, globals: Globals): Calculation | -1 {
	return variadicNodesSolver(minNode, globals, solveMin);
}

const roundingStrategies = new Set([
	'nearest',
	'up',
	'down',
	'to-zero',
]);

function round(roundNode: FunctionNode, globals: Globals): Calculation | -1 {
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
				const tokenStr = toLowerCaseAZ(token[4].value);
				if (roundingStrategies.has(tokenStr)) {
					roundingStrategy = tokenStr;
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

function mod(modNode: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(modNode, globals, solveMod);
}

function rem(remNode: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(remNode, globals, solveRem);
}

function abs(absNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(absNode, globals, solveAbs);
}

function sign(signNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(signNode, globals, solveSign);
}

function sin(sinNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(sinNode, globals, solveSin);
}

function cos(codNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(codNode, globals, solveCos);
}

function tan(tanNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(tanNode, globals, solveTan);
}

function asin(asinNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(asinNode, globals, solveASin);
}

function acos(acosNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(acosNode, globals, solveACos);
}

function atan(atanNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(atanNode, globals, solveATan);
}

function atan2(atan2Node: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(atan2Node, globals, solveATan2);
}

function exp(expNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(expNode, globals, solveExp);
}

function sqrt(sqrtNode: FunctionNode, globals: Globals): Calculation | -1 {
	return singleNodeSolver(sqrtNode, globals, solveSqrt);
}

function pow(powNode: FunctionNode, globals: Globals): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(powNode, globals, solvePow);
}

function hypot(hypotNode: FunctionNode, globals: Globals): Calculation | -1 {
	return variadicNodesSolver(hypotNode, globals, solveHypot);
}

function log(logNode: FunctionNode, globals: Globals): Calculation | -1 {
	return variadicNodesSolver(logNode, globals, solveLog);
}
