import { patchNaN } from './nan';
import { patchInfinity } from './infinity';
import { patchMinusZero } from './minus-zero';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { patchPrecision } from './precision';

export function patchCalcResult(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	return patchPrecision(patchMinusZero(patchInfinity(patchNaN(x))));
}
