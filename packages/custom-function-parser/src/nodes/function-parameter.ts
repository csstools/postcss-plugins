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

	// Cache until `colon` or `defaultValue` is replaced.
	private defaultValueCache: {
		colon: TokenColon | null,
		tokens: Array<CSSToken>,
		value: string | null,
	} | null = null;

	constructor(name: TokenIdent, parameterType: Array<CSSToken>, colon: TokenColon | null, defaultValue: Array<CSSToken>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.parameterType = parameterType;
		this.colon = colon;
		this.defaultValue = defaultValue;
		this.before = before;
		this.after = after;
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

	getDefaultValue(): string | null {
		const cache = this.defaultValueCache;
		if (cache && cache.colon === this.colon && cache.tokens === this.defaultValue) {
			return cache.value;
		}

		let defaultValue: string | null = null;
		if (this.colon) {
			const componentValues = parseListOfComponentValues(this.defaultValue);
			const block = singleCurlyBlock(componentValues);
			const value = block ? block.value : componentValues;
			defaultValue = stringify(tokensOf(value)).trim();
		}

		this.defaultValueCache = {
			colon: this.colon,
			tokens: this.defaultValue,
			value: defaultValue,
		};

		return defaultValue;
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
		return stringify(this.tokens());
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
