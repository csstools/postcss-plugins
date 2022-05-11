import type { FunctionNode, WordNode, Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';

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

const toRad = {
	turn: turnToRad,
	deg: degToRad,
	grad: gradToRad,
};

export function functionNodeToWordNode(fn: FunctionNode): WordNode {
	delete fn.nodes;
	const node = fn as Node;
	node.type = 'word';

	return node as WordNode;
}

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

export function validateNode(
	node: FunctionNode,
	parseUnit = true,
	args = 1,
): [WordNode,number] | undefined {
	const words = node.nodes.filter(childNode => childNode.type === 'word');

	if (words.length !== args) {
		return;
	}

	const { value } = words[0];

	const parsed = valueParser.unit(value);
	let number;

	if (value.toLowerCase() === 'infinity' ) {
		number = Infinity;
	} else if (value.toLowerCase() === '-infinity') {
		number = Infinity * -1;
	}

	if (!parsed && !number) {
		return;
	}

	if (parsed) {
		number = Number(parsed.number);

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
	}

	return [
		functionNodeToWordNode(node),
		number,
	];
}

export { toRad };
