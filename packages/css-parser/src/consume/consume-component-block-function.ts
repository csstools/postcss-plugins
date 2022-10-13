import { CSSToken, mirrorVariant, stringify, TokenType, isToken, TokenIdent, TokenFunction } from '@csstools/css-tokenizer';

export type ComponentValue = FunctionNode | SimpleBlockNode | CSSToken;

export class ComponentValueNode {
	type = 'component-value';

	value: ComponentValue;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(value: ComponentValue, before: Array<CSSToken>, after: Array<CSSToken>) {
		this.value = value;
		this.before = before;
		this.after = after;
	}

	toString() {
		if (isToken(this.value)) {
			return stringify(
				...this.before,
				this.value,
				...this.after,
			);
		}

		return stringify(...this.before) + this.value.toString() + stringify(...this.after);
	}
}

// https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
export function consumeComponentValue(tokens: Array<CSSToken>): { advance: number, node: ComponentValue } {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (
			token[0] === TokenType.OpenParen ||
			token[0] === TokenType.OpenCurly ||
			token[0] === TokenType.OpenSquare
		) {
			const r = consumeSimpleBlock(tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		if (token[0] === TokenType.Function) {
			const r = consumeFunction(tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		return {
			advance: i,
			node: token,
		};
	}
}

export class FunctionNode {
	type = 'function';

	name: TokenFunction;
	value: Array<ComponentValue>;
	after: Array<CSSToken>;

	constructor(name: TokenFunction, value: Array<ComponentValue>, after: Array<CSSToken>) {
		this.name = name;
		this.value = value;
		this.after = after;
	}

	get nameTokenValue(): string {
		return this.name[4].value;
	}

	toString() {
		return stringify(this.name) + this.value.map((x) => x.toString()).join('') + stringify(...this.after);
	}
}

// https://www.w3.org/TR/css-syntax-3/#consume-function
export function consumeFunction(tokens: Array<CSSToken>): { advance: number, node: FunctionNode } {
	const valueList: Array<ComponentValueNode> = [];
	let lastValueIndex = -1;

	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];

		if (token[0] === TokenType.CloseParen) {
			return {
				advance: i,
				node: new FunctionNode(
					tokens[0] as TokenFunction,
					valueList,
					tokens.slice(lastValueIndex, i+1),
				),
			};
		}

		const r = consumeComponentValue(tokens.slice(i));
		i += r.advance;
		lastValueIndex = i;
		valueList.push(r.node);
	}

	throw new Error('Failed to parse');
}

export class SimpleBlockNode {
	type = 'simple-block';

	name: Array<CSSToken>;
	value: Array<ComponentValueNode>;

	constructor(name: Array<CSSToken>, value: Array<ComponentValueNode>) {
		this.name = name;
		this.value = value;
	}

	get nameIdentIndex(): number {
		return this.name.findIndex((x) => {
			return x[0] === TokenType.Ident;
		});
	}

	toString() {
		return stringify(...this.name) + this.value.map((x) => x.toString()).join('');
	}
}

/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
export function consumeSimpleBlock(tokens: Array<CSSToken>): { advance: number, node: SimpleBlockNode } {
	const endingToken = mirrorVariant(tokens[0][0]);
	if (!endingToken) {
		throw new Error('Failed to parse');
	}

	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];

		if (token[0] === endingToken) {
			return i;
		}

		i += consumeComponentValue(tokens.slice(i));
	}

	throw new Error('Failed to parse');
}
