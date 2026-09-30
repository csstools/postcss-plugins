import { CustomFunction } from '../nodes/custom-function';
import { FunctionParameter } from '../nodes/function-parameter';

export function isCustomFunction(x: unknown): x is CustomFunction {
	return CustomFunction.isCustomFunction(x);
}

export function isFunctionParameter(x: unknown): x is FunctionParameter {
	return FunctionParameter.isFunctionParameter(x);
}
