import { patchNaN } from './nan';
import { patchInfinity } from './infinity';
import { patchMinusZero } from './minus-zero';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { patchPrecision } from './precision';
import { patchCanonicalUnit } from './canonical-unit';
import type { conversionOptions } from '../options';

export function patchCalcResult(x: TokenNode | FunctionNode | -1, options?: conversionOptions): TokenNode | FunctionNode | -1 {
	let y: TokenNode | FunctionNode | -1 = x;

	if (!options?.censorIntoStandardRepresentableValues) {
		y = patchNaN(y);
		y = patchInfinity(y);
	}

	if (options?.toCanonicalUnits) {
		y = patchCanonicalUnit(y);
	}

	y = patchPrecision(y, options?.precision);
	y = patchMinusZero(y);

	return y;
}
