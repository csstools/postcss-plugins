import type { Calculation } from '../calculation';
import type { ComponentValue, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import type { Globals } from '../util/globals';
import { TokenType, NumberType, isTokenOpenParen, isTokenDelim, isTokenComma, isTokenIdent } from '@csstools/css-tokenizer';
import { addition } from '../operation/addition';
import { division } from '../operation/division';
import { isCalculation, solve } from '../calculation';
import { isCommentNode, FunctionNode, TokenNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
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
import { isNone } from '../util/is-none';
import type { conversionOptions } from '../options';

type mathFunction = (node: FunctionNode, globals: Globals, options: conversionOptions) => Calculation | -1

export const mathFunctions: Map<string, mathFunction> = new Map([
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

function calc(calcNode: FunctionNode | SimpleBlockNode, globals: Globals, options: conversionOptions): Calculation | -1 {
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
		if (isSimpleBlockNode(child) && isTokenOpenParen(child.startToken)) {
			const subCalc = calc(child, globals, options);
			if (subCalc === -1) {
				return -1;
			}
			nodes.splice(i, 1, subCalc);
			continue;
		}

		if (isFunctionNode(child)) {
			const mathFunction = mathFunctions.get(child.getName().toLowerCase());
			if (!mathFunction) {
				return -1;
			}

			const subCalc = mathFunction(child, globals, options);
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
		if (!isTokenDelim(token) || !(token[4].value === '*' || token[4].value === '/')) {
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
		if (!isTokenDelim(token) || !(token[4].value === '+' || token[4].value === '-')) {
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

function singleNodeSolver(fnNode: FunctionNode, globals: Globals, options: conversionOptions, solveFn: (node: FunctionNode, a: TokenNode, options: conversionOptions) => Calculation | -1): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(fnNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	const a = solve(calc(calcWrapper(nodes), globals, options));
	if (a === -1) {
		return -1;
	}

	return solveFn(fnNode, a, options);
}

function twoCommaSeparatedNodesSolver(fnNode: FunctionNode, globals: Globals, options: conversionOptions, solveFn: (node: FunctionNode, a: TokenNode, b: TokenNode, options: conversionOptions) => Calculation | -1): Calculation | -1 {
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

			if (isTokenNode(node) && isTokenComma(node.value)) {
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

	const a = solve(calc(calcWrapper(aValue), globals, options));
	if (a === -1) {
		return -1;
	}

	const b = solve(calc(calcWrapper(bValue), globals, options));
	if (b === -1) {
		return -1;
	}

	return solveFn(fnNode, a, b, options);
}

function variadicNodesSolver(fnNode: FunctionNode, globals: Globals, options: conversionOptions, solveFn: (node: FunctionNode, x: Array<ComponentValue>, options: conversionOptions) => Calculation | -1): Calculation | -1 {
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
			if (isTokenNode(node) && isTokenComma(node.value)) {
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

			const solvedChunk = solve(calc(calcWrapper(chunks[i]), globals, options));
			if (solvedChunk === -1) {
				return -1;
			}

			solvedNodes.push(solvedChunk);
		}
	}

	return solveFn(fnNode, solvedNodes, options);
}

function clamp(clampNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
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
			if (isTokenNode(node) && isTokenComma(node.value)) {
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

	const minimumIsNone = isNone(minimumValue);
	const maximumIsNone = isNone(maximumValue);
	if (minimumIsNone && maximumIsNone) {
		return calc(calcWrapper(centralValue), globals, options);
	}

	const central = solve(calc(calcWrapper(centralValue), globals, options));
	if (central === -1) {
		return -1;
	}

	{
		if (minimumIsNone) {
			const maximum = solve(calc(calcWrapper(maximumValue), globals, options));
			if (maximum === -1) {
				return -1;
			}

			return solveMin(minWrapper(central, maximum), [central, maximum], options);
		} else if (maximumIsNone) {
			const minimum = solve(calc(calcWrapper(minimumValue), globals, options));
			if (minimum === -1) {
				return -1;
			}

			return solveMax(maxWrapper(minimum, central), [minimum, central], options);
		}
	}

	const minimum = solve(calc(calcWrapper(minimumValue), globals, options));
	if (minimum === -1) {
		return -1;
	}

	const maximum = solve(calc(calcWrapper(maximumValue), globals, options));
	if (maximum === -1) {
		return -1;
	}

	return solveClamp(clampNode, minimum, central, maximum, options);
}

function max(maxNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return variadicNodesSolver(maxNode, globals, options, solveMax);
}

function min(minNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return variadicNodesSolver(minNode, globals, options, solveMin);
}

const roundingStrategies = new Set([
	'nearest',
	'up',
	'down',
	'to-zero',
]);

function round(roundNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	const nodes: Array<ComponentValue> = resolveGlobalsAndConstants(
		[...(roundNode.value.filter(x => !isCommentNode(x) && !isWhitespaceNode(x)))],
		globals,
	);

	let roundingStrategy = '';
	let hasComma = false;
	const aValue: Array<ComponentValue> = [];
	const bValue: Array<ComponentValue> = [];

	{
		let focus = aValue;

		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (!roundingStrategy && aValue.length === 0 && bValue.length === 0 && isTokenNode(node) && isTokenIdent(node.value)) {
				const token = node.value;
				const tokenStr = token[4].value.toLowerCase();
				if (roundingStrategies.has(tokenStr)) {
					roundingStrategy = tokenStr;
					continue;
				}
			}

			if (isTokenNode(node) && isTokenComma(node.value)) {
				if (focus === bValue) {
					return -1;
				}

				if (focus === aValue && roundingStrategy && aValue.length === 0) {
					continue;
				}

				if (focus === aValue) {
					hasComma = true;
					focus = bValue;
					continue;
				}

				return -1;
			}

			focus.push(node);
		}
	}

	const a = solve(calc(calcWrapper(aValue), globals, options));
	if (a === -1) {
		return -1;
	}

	if (!hasComma && bValue.length === 0) {
		bValue.push(
			new TokenNode(
				[TokenType.Number, '1', -1, -1, { value: 1, type: NumberType.Integer }],
			),
		);
	}

	const b = solve(calc(calcWrapper(bValue), globals, options));
	if (b === -1) {
		return -1;
	}

	if (!roundingStrategy) {
		roundingStrategy = 'nearest';
	}

	return solveRound(roundNode, roundingStrategy, a, b, options);
}

function mod(modNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(modNode, globals, options, solveMod);
}

function rem(remNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(remNode, globals, options, solveRem);
}

function abs(absNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(absNode, globals, options, solveAbs);
}

function sign(signNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(signNode, globals, options, solveSign);
}

function sin(sinNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(sinNode, globals, options, solveSin);
}

function cos(codNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(codNode, globals, options, solveCos);
}

function tan(tanNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(tanNode, globals, options, solveTan);
}

function asin(asinNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(asinNode, globals, options, solveASin);
}

function acos(acosNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(acosNode, globals, options, solveACos);
}

function atan(atanNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(atanNode, globals, options, solveATan);
}

function atan2(atan2Node: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(atan2Node, globals, options, solveATan2);
}

function exp(expNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(expNode, globals, options, solveExp);
}

function sqrt(sqrtNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return singleNodeSolver(sqrtNode, globals, options, solveSqrt);
}

function pow(powNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return twoCommaSeparatedNodesSolver(powNode, globals, options, solvePow);
}

function hypot(hypotNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return variadicNodesSolver(hypotNode, globals, options, solveHypot);
}

function log(logNode: FunctionNode, globals: Globals, options: conversionOptions): Calculation | -1 {
	return variadicNodesSolver(logNode, globals, options, solveLog);
}

function calcWrapper(v: Array<ComponentValue>): FunctionNode {
	return new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		v,
	);
}

function minWrapper(a: ComponentValue, b: ComponentValue): FunctionNode {
	return new FunctionNode(
		[TokenType.Function, 'min(', -1, -1, { value: 'min' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			a,
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			b,
		],
	);
}

function maxWrapper(a: ComponentValue, b: ComponentValue): FunctionNode {
	return new FunctionNode(
		[TokenType.Function, 'max(', -1, -1, { value: 'max' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			a,
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			b,
		],
	);
}
