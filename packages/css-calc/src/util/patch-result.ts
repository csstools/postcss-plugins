import { patchNaN } from './nan';
import { patchInfinity } from './infinity';
import { patchMinusZero } from './minus-zero';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { patchPrecision } from './precision';

export function patchCalcResult(x: TokenNode | FunctionNode | -1, precision: number): TokenNode | FunctionNode | -1 {
	const postNaN = patchNaN(x);
	const postInfinity = patchInfinity(postNaN);
	const postPrecision = patchPrecision(postInfinity, precision);
	const postMinusZero = patchMinusZero(postPrecision);

	return postMinusZero;
}
