import type { FunctionNode, WordNode, Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import vm from 'node:vm';

export function turnToRad(turn: number): number {
	return turn * 2 * Math.PI;
}

export function degToRad(deg: number): number {
	return deg * (Math.PI / 180);
}

export function gradToRad(grad: number): number {
	return grad * (Math.PI / 200);
}

export function radToDeg(rad: number): number {
	return rad * ( 180 / Math.PI );
}

export function gradToDeg(grad: number): number {
	return grad * 180 / 200;
}

export function turnToDeg(turn: number): number {
	return turn * 360;
}

const toRad = {
	turn: turnToRad,
	deg: degToRad,
	grad: gradToRad,
};

const toDeg = {
	grad: gradToDeg,
	turn: turnToDeg,
	rad: radToDeg,
};

export function filterOnlyWords(node: Node): boolean {
	return node.type === 'word';
}

const ALLOWED_OPERATIONS = [
	'+',
	'-',
	'*',
	'/',
];

enum ExpressionPart {
	Number,
	Operation
}

/**
 * Try to compute a calculation from a Node.
 *
 * This validates that the calculation has a valid order which is:
 * - `{Number} {Operation} {Number} ...`
 *
 * Only basic arithmetic operations are allowed, and it has to be separate words
 * similarly to how CSS calc works:
 *
 * - `sin(3.14159 * 2)` -> is valid
 * - `sin(3.14159*2)` -> is not valid
 *
 *
 * @param {FunctionNode} nodes Nodes to be parsed
 * @param {Boolean} ignoreUnit Whether units are ignored or converted to radians
 * @return {FunctionNode} Returns the node, if it managed to calculate, it will
 * simplify inner nodes.
 * @see https://www.w3.org/TR/css-values-4/#trig-funcs
 */
export function computeCalculation(nodes: Node[], ignoreUnit = false) {
	let isValid = true;
	const expression = [];
	const filteredNodes = nodes.filter(
		node => node.type === 'word' || ALLOWED_OPERATIONS.includes(node.value),
	);
	let operationPart = ExpressionPart.Number;
	let detectedUnit;

	const addToExpression = (part: string, type: ExpressionPart) => {
		if (operationPart !== type) {
			isValid = false;
			return;
		}

		expression.push(part);
		operationPart = type === ExpressionPart.Number
			? ExpressionPart.Operation
			: ExpressionPart.Number;
	};

	for (let i = 0, len = filteredNodes.length; i < len && isValid; i++) {
		const word = filteredNodes[i];

		if (ALLOWED_OPERATIONS.includes(word.value)) {
			addToExpression(word.value, ExpressionPart.Operation);
			continue;
		}

		if (word.value === 'pi') {
			addToExpression(Math.PI.toString(), ExpressionPart.Number);
			continue;
		}

		if (word.value === 'e') {
			addToExpression(Math.E.toString(), ExpressionPart.Number);
			continue;
		}

		const parsed = valueParser.unit(word.value);

		// This could be an unsupported expression
		if (!parsed) {
			isValid = false;
			break;
		}

		if (ignoreUnit) {
			if (!detectedUnit) {
				detectedUnit = parsed.unit;
			}

			// Can't calculate from different units when unit is ignored
			if (detectedUnit !== parsed.unit) {
				isValid = false;
				break;
			}

			addToExpression(word.value, ExpressionPart.Operation);
			continue;
		}

		// Is it unitless? Assume radians
		if (!parsed.unit) {
			addToExpression(word.value, ExpressionPart.Number);
			continue;
		}

		if (parsed.unit === 'rad') {
			addToExpression(parsed.number, ExpressionPart.Number);
			continue;
		}

		if (typeof toRad[parsed.unit] === 'function') {
			const number = toRad[parsed.unit](Number(parsed.number));

			if (!Number.isNaN(number) && Number.isFinite(number)) {
				addToExpression(number.toString(), ExpressionPart.Number);
				continue;
			} else {
				isValid = false;
				break;
			}
		}

		isValid = false;
	}

	if (!isValid) {
		return nodes;
	}

	// For expressions to be valid they have to be either 3
	// or subsequent even numbers of elements
	// {Number} {Operation} {Number} -> 3
	// {Number} {Operation} {Number} {Operation} {Number} -> 5
	// ... and so on
	// Otherwise don't bother computing
	if (expression.length % 2 === 0 || expression.length < 3) {
		return nodes;
	}

	let result;

	try {
		const context = vm.createContext({ result: NaN });
		const calculation = new vm.Script(`result = ${expression.join(' ')}`);
		calculation.runInContext(context);

		if (typeof context.result === 'number' && !Number.isNaN(context.result) && Number.isFinite(context.result)) {
			result = context.result;
		}
	} catch(error) {
		// Error silently
	}

	if (typeof result !== 'undefined') {
		let value = result.toString();

		if (detectedUnit) {
			value += detectedUnit;
		}

		const sourceIndex = nodes[0].sourceIndex;
		const sourceEndIndex = value.length;

		nodes.length = 0;
		nodes.push({
			type: 'word',
			value,
			sourceIndex,
			sourceEndIndex,
		});
	}

	return nodes;
}

export function functionNodeToWordNode(fn: FunctionNode): WordNode {
	delete fn.nodes;
	const node = fn as Node;
	node.type = 'word';

	return node as WordNode;
}

/**
 * Formats a number that's intended to be put into CSS.
 *
 * Due to processing of Number(number.toFixed(decimals)) this will get
 * rid of ending zeroes, usually helping with the rounding which is the
 * intended effect.
 *
 * For example, converting 4.71238898038469 radians into deg leads to
 * 270.000000000669786 which is going to result as 270 unless a
 * precision of 10 is chosen.
 *
 * @param {Number} number Number to be formatted
 * @param {Number} decimals Precision of decimals, CSS doesn't usually handle further than 5.
 */
export function formatResultingNumber(number: number, decimals: number): string {
	if (!Number.isNaN(number)) {
		if (number > Number.MAX_SAFE_INTEGER) {
			return 'infinity';
		} else if (number < Number.MIN_SAFE_INTEGER) {
			return '-infinity';
		}
	}

	return Number(number.toFixed(decimals)).toString();
}

export function parseNumber(value: string) {
	let number;
	let unit = '';

	if (value.toLowerCase() === 'infinity' ) {
		number = Infinity;
	} else if (value.toLowerCase() === '-infinity') {
		number = Infinity * -1;
	} else if (value === 'pi') {
		number = Math.PI;
	} else if (value === 'e') {
		number = Math.E;
	}

	if (!number) {
		const parsed = valueParser.unit(value);

		if (!parsed) {
			return false;
		}

		number = Number(parsed.number);

		if (!Number.isNaN(number)) {
			unit = parsed.unit;
		}
	}

	return {
		number,
		unit,
	};
}

type validateNodeReturn = [WordNode, number] | undefined;

export function validateNode(
	node: FunctionNode,
	parseUnit = true,
): validateNodeReturn {
	node.nodes = computeCalculation(node.nodes);
	const words = node.nodes.filter(filterOnlyWords);

	if (node.nodes.length !== 1 || words.length !== 1) {
		return;
	}

	const { value } = words[0];

	const parsed = parseNumber(value);

	if (!parsed) {
		return;
	}

	let number = parsed.number;

	if (parseUnit) {
		if (parsed.unit && parsed.unit !== 'rad') {
			if (toRad[parsed.unit]) {
				number = toRad[parsed.unit](number);
			} else {
				return;
			}
		}
	} else if (parsed.unit) {
		return;
	}

	return [
		functionNodeToWordNode(node),
		number,
	];
}

export { toRad, toDeg };
