import type { CSSToken } from '@csstools/css-tokenizer';
import { stringify } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
import type { FunctionParameter } from './function-parameter';
import type { FunctionNode } from '@csstools/css-parser-algorithms';

export class CustomFunction {
	type = NodeType.CustomFunction;

	function: FunctionNode;
	parameters: Array<FunctionParameter>;
	returnsKeyword: Array<CSSToken>;
	returnType: Array<CSSToken>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(fn: FunctionNode, parameters: Array<FunctionParameter>, returnsKeyword: Array<CSSToken>, returnType: Array<CSSToken>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.function = fn;
		this.parameters = parameters;
		this.returnsKeyword = returnsKeyword;
		this.returnType = returnType;
		this.before = before;
		this.after = after;
	}

	getName(): string {
		return this.function.getName();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.function.tokens(),
			...this.returnsKeyword,
			...this.returnType,
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + stringify(...this.function.tokens()) + stringify(...this.returnsKeyword) + stringify(...this.returnType) + stringify(...this.after);
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			name: this.getName(),
			string: this.toString(),
			tokens: this.tokens(),
			parameters: this.parameters.map((x) => x.toJSON()),
			returnsKeyword: this.returnsKeyword,
			returnType: this.returnType,
			before: this.before,
			after: this.after,
		};
	}

	/**
	 * @internal
	 */
	isCustomFunction(): this is CustomFunction {
		return CustomFunction.isCustomFunction(this);
	}

	static isCustomFunction(x: unknown): x is CustomFunction {
		if (!x) {
			return false;
		}

		if (!(x instanceof CustomFunction)) {
			return false;
		}

		return x.type === NodeType.CustomFunction;
	}
}
