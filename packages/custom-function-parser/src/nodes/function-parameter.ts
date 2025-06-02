import type { CSSToken, TokenColon, TokenIdent} from '@csstools/css-tokenizer';
import { isTokenComment, stringify } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';

export class FunctionParameter {
	type = NodeType.FunctionParameter;

	name: TokenIdent;
	argumentType: Array<CSSToken>;
	colon: TokenColon | null;
	defaultValue: Array<CSSToken>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(name: TokenIdent, argumentType: Array<CSSToken>, colon: TokenColon | null, defaultValue: Array<CSSToken>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.argumentType = argumentType;
		this.colon = colon;
		this.defaultValue = defaultValue;
		this.before = before;
		this.after = after;
	}

	getName(): string {
		return this.name[4].value;
	}

	getNameToken(): TokenIdent | null {
		return this.name;
	}

	getArgumentType(): string {
		return stringify(...this.argumentType.filter((x) => !isTokenComment(x))).trim();
	}

	getDefaultValue(): string {
		return stringify(...this.defaultValue).trim();
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			name: this.getName(),
			argumentType: this.argumentType,
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
