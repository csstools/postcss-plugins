import type { CSSToken, TokenColon, TokenIdent } from '@csstools/css-tokenizer';
import { stringify } from '@csstools/css-tokenizer';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { NodeType } from '../util/node-type';
import { tokensOf } from '../util/component-values';
import { getSyntaxString } from '../util/syntax-string';
import { singleCurlyBlock } from '../util/declaration-value';

/**
 * A `<function-parameter>`.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-function-parameter
 */
export class FunctionParameter {
	type = NodeType.FunctionParameter;

	name: TokenIdent;
	parameterType: Array<CSSToken>;
	colon: TokenColon | null;
	defaultValue: Array<CSSToken>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(name: TokenIdent, parameterType: Array<CSSToken>, colon: TokenColon | null, defaultValue: Array<CSSToken>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.parameterType = parameterType;
		this.colon = colon;
		this.defaultValue = defaultValue;
		this.before = before;
		this.after = after;
	}

	/**
	 * @deprecated Use `parameterType` instead.
	 */
	get argumentType(): Array<CSSToken> {
		return this.parameterType;
	}

	set argumentType(value: Array<CSSToken>) {
		this.parameterType = value;
	}

	getName(): string {
		return this.name[4].value;
	}

	getNameToken(): TokenIdent {
		return this.name;
	}

	getParameterType(): string {
		return getSyntaxString(this.parameterType);
	}

	/**
	 * @deprecated Use `getParameterType()` instead.
	 */
	getArgumentType(): string {
		return this.getParameterType();
	}

	getDefaultValue(): string | null {
		if (!this.colon) {
			return null;
		}

		const componentValues = parseListOfComponentValues(this.defaultValue);
		const block = singleCurlyBlock(componentValues);
		const value = block ? block.value : componentValues;

		return stringify(...tokensOf(value)).trim();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			this.name,
			...this.parameterType,
			...(this.colon ? [this.colon] : []),
			...this.defaultValue,
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.tokens());
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
			parameterType: this.parameterType,
			colon: this.colon,
			defaultValue: this.defaultValue,
			before: this.before,
			after: this.after,
		};
	}

	/**
	 * @internal
	 */
	isFunctionParameter(): this is FunctionParameter {
		return FunctionParameter.isFunctionParameter(this);
	}

	static isFunctionParameter(x: unknown): x is FunctionParameter {
		if (!x) {
			return false;
		}

		if (!(x instanceof FunctionParameter)) {
			return false;
		}

		return x.type === NodeType.FunctionParameter;
	}
}
