import { CSSToken, mirrorVariantType, mirrorVariant, stringify, TokenType, isToken, TokenFunction, ParseError } from '@csstools/css-tokenizer';
import { Context } from '../interfaces/context';
import { ComponentValueType } from '../util/component-value-type';

export type ContainerNode = FunctionNode | SimpleBlockNode;

export type ComponentValue = FunctionNode | SimpleBlockNode | WhitespaceNode | CommentNode | TokenNode;

// https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
export function consumeComponentValue(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: ComponentValue } {
	const token = tokens[0];
	if (
		token[0] === TokenType.OpenParen ||
		token[0] === TokenType.OpenCurly ||
		token[0] === TokenType.OpenSquare
	) {
		const r = consumeSimpleBlock(ctx, tokens);
		return {
			advance: r.advance,
			node: r.node,
		};
	}

	if (token[0] === TokenType.Function) {
		const r = consumeFunction(ctx, tokens);
		return {
			advance: r.advance,
			node: r.node,
		};
	}

	if (token[0] === TokenType.Whitespace) {
		const r = consumeWhitespace(ctx, tokens);
		return {
			advance: r.advance,
			node: r.node,
		};
	}

	if (token[0] === TokenType.Comment) {
		const r = consumeComment(ctx, tokens);
		return {
			advance: r.advance,
			node: r.node,
		};
	}

	return {
		advance: 1,
		node: new TokenNode(token),
	};
}

export class FunctionNode {
	type: ComponentValueType = ComponentValueType.Function;

	name: TokenFunction;
	endToken: CSSToken;
	value: Array<ComponentValue>;

	constructor(name: TokenFunction, endToken: CSSToken, value: Array<ComponentValue>) {
		this.name = name;
		this.endToken = endToken;
		this.value = value;
	}

	getName(): string {
		return this.name[4].value;
	}

	/**
	 * Normalize the current Function:
	 * - if the "endToken" is EOF, replace with a ")-token"
	 */
	normalize() {
		if (this.endToken[0] === TokenType.EOF) {
			this.endToken = [TokenType.CloseParen, ')', -1, -1, undefined];
		}
	}

	tokens(): Array<CSSToken> {
		if (this.endToken[0] === TokenType.EOF) {
			return [
				this.name,
				...this.value.flatMap((x) => {
					return x.tokens();
				}),
			];
		}

		return [
			this.name,
			...this.value.flatMap((x) => {
				return x.tokens();
			}),
			this.endToken,
		];
	}

	toString(): string {
		const valueString = this.value.map((x) => {
			if (isToken(x)) {
				return stringify(x);
			}

			return x.toString();
		}).join('');

		return stringify(this.name) + valueString + stringify(this.endToken);
	}

	indexOf(item: ComponentValue): number | string {
		return this.value.indexOf(item);
	}

	at(index: number | string): ComponentValue | undefined {
		if (typeof index === 'number') {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: ComponentValue, parent: ContainerNode, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let aborted = false;

		this.value.forEach((child, index) => {
			if (aborted) {
				return;
			}

			let stateClone: T | undefined = undefined;
			if (state) {
				stateClone = {
					...state,
				};
			}

			if (cb({ node: child, parent: this, state: stateClone }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child && this.value.includes(child)) {
				if (child.walk(cb, stateClone) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON(): unknown {
		return {
			type: this.type,
			name: this.getName(),
			tokens: this.tokens(),
			value: this.value.map((x) => x.toJSON()),
		};
	}

	isFunctionNode(): this is FunctionNode {
		return FunctionNode.isFunctionNode(this);
	}

	static isFunctionNode(x: unknown): x is FunctionNode {
		if (!x) {
			return false;
		}

		if (!(x instanceof FunctionNode)) {
			return false;
		}

		return x.type === ComponentValueType.Function;
	}
}

// https://www.w3.org/TR/css-syntax-3/#consume-function
export function consumeFunction(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: FunctionNode } {
	const value: Array<ComponentValue> = [];

	let i = 1;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = tokens[i];
		if (!token || token[0] === TokenType.EOF) {
			ctx.onParseError(new ParseError(
				'Unexpected EOF while consuming a function.',
				tokens[0][2],
				tokens[tokens.length - 1][3],
				[
					'5.4.9. Consume a function',
					'Unexpected EOF',
				],
			));

			return {
				advance: tokens.length,
				node: new FunctionNode(tokens[0] as TokenFunction, token, value),
			};
		}

		if (token[0] === TokenType.CloseParen) {
			return {
				advance: i + 1,
				node: new FunctionNode(tokens[0] as TokenFunction, token, value),
			};
		}

		if (token[0] === TokenType.Comment || token[0] === TokenType.Whitespace) {
			const result = consumeAllCommentsAndWhitespace(ctx, tokens.slice(i));
			i += result.advance;
			value.push(...result.nodes);
			continue;
		}

		const result = consumeComponentValue(ctx, tokens.slice(i));
		i += result.advance;
		value.push(result.node);
	}
}

export class SimpleBlockNode {
	type: ComponentValueType = ComponentValueType.SimpleBlock;

	startToken: CSSToken;
	endToken: CSSToken;
	value: Array<ComponentValue>;

	constructor(startToken: CSSToken, endToken: CSSToken, value: Array<ComponentValue>) {
		this.startToken = startToken;
		this.endToken = endToken;
		this.value = value;
	}

	/**
	 * Normalize the current Simple Block:
	 * - if the "endToken" is EOF, replace with the mirror token of the "startToken"
	 */
	normalize() {
		if (this.endToken[0] === TokenType.EOF) {
			const mirror = mirrorVariant(this.startToken);
			if (mirror) {
				this.endToken = mirror;
			}
		}
	}

	tokens(): Array<CSSToken> {
		if (this.endToken[0] === TokenType.EOF) {
			return [
				this.startToken,
				...this.value.flatMap((x) => {
					return x.tokens();
				}),
			];
		}

		return [
			this.startToken,
			...this.value.flatMap((x) => {
				return x.tokens();
			}),
			this.endToken,
		];
	}

	toString(): string {
		const valueString = this.value.map((x) => {
			if (isToken(x)) {
				return stringify(x);
			}

			return x.toString();
		}).join('');

		return stringify(this.startToken) + valueString + stringify(this.endToken);
	}

	indexOf(item: ComponentValue): number | string {
		return this.value.indexOf(item);
	}

	at(index: number | string): ComponentValue | undefined {
		if (typeof index === 'number') {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: ComponentValue, parent: ContainerNode, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let aborted = false;

		this.value.forEach((child, index) => {
			if (aborted) {
				return;
			}

			let stateClone: T | undefined = undefined;
			if (state) {
				stateClone = {
					...state,
				};
			}

			if (cb({ node: child, parent: this, state: stateClone }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child && this.value.includes(child)) {
				if (child.walk(cb, stateClone) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON(): unknown {
		return {
			type: this.type,
			startToken: this.startToken,
			tokens: this.tokens(),
			value: this.value.map((x) => x.toJSON()),
		};
	}

	isSimpleBlockNode(): this is SimpleBlockNode {
		return SimpleBlockNode.isSimpleBlockNode(this);
	}

	static isSimpleBlockNode(x: unknown): x is SimpleBlockNode {
		if (!x) {
			return false;
		}

		if (!(x instanceof SimpleBlockNode)) {
			return false;
		}

		return x.type === ComponentValueType.SimpleBlock;
	}
}

/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
export function consumeSimpleBlock(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: SimpleBlockNode } {
	const endingTokenType = mirrorVariantType(tokens[0][0]);
	if (!endingTokenType) {
		throw new Error('Failed to parse, a mirror variant must exist for all block open tokens.');
	}

	const value: Array<ComponentValue> = [];

	let i = 1;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = tokens[i];
		if (!token || token[0] === TokenType.EOF) {
			ctx.onParseError(new ParseError(
				'Unexpected EOF while consuming a simple block.',
				tokens[0][2],
				tokens[tokens.length - 1][3],
				[
					'5.4.8. Consume a simple block',
					'Unexpected EOF',
				],
			));

			return {
				advance: tokens.length,
				node: new SimpleBlockNode(tokens[0], token, value),
			};
		}

		if (token[0] === endingTokenType) {
			return {
				advance: i + 1,
				node: new SimpleBlockNode(tokens[0], token, value),
			};
		}

		if (token[0] === TokenType.Comment || token[0] === TokenType.Whitespace) {
			const result = consumeAllCommentsAndWhitespace(ctx, tokens.slice(i));
			i += result.advance;
			value.push(...result.nodes);
			continue;
		}

		const result = consumeComponentValue(ctx, tokens.slice(i));
		i += result.advance;
		value.push(result.node);
	}
}

export class WhitespaceNode {
	type: ComponentValueType = ComponentValueType.Whitespace;

	value: Array<CSSToken>;

	constructor(value: Array<CSSToken>) {
		this.value = value;
	}

	tokens(): Array<CSSToken> {
		return this.value;
	}

	toString(): string {
		return stringify(...this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	isWhitespaceNode(): this is WhitespaceNode {
		return WhitespaceNode.isWhitespaceNode(this);
	}

	static isWhitespaceNode(x: unknown): x is WhitespaceNode {
		if (!x) {
			return false;
		}

		if (!(x instanceof WhitespaceNode)) {
			return false;
		}

		return x.type === ComponentValueType.Whitespace;
	}
}

export function consumeWhitespace(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: WhitespaceNode } {
	let i = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = tokens[i];
		if (token[0] !== TokenType.Whitespace) {
			return {
				advance: i,
				node: new WhitespaceNode(tokens.slice(0, i)),
			};
		}

		i++;
	}
}

export class CommentNode {
	type: ComponentValueType = ComponentValueType.Comment;

	value: CSSToken;

	constructor(value: CSSToken) {
		this.value = value;
	}

	tokens(): Array<CSSToken> {
		return [
			this.value,
		];
	}

	toString(): string {
		return stringify(this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	isCommentNode(): this is CommentNode {
		return CommentNode.isCommentNode(this);
	}

	static isCommentNode(x: unknown): x is CommentNode {
		if (!x) {
			return false;
		}

		if (!(x instanceof CommentNode)) {
			return false;
		}

		return x.type === ComponentValueType.Comment;
	}
}

export function consumeComment(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: CommentNode } {
	return {
		advance: 1,
		node: new CommentNode(tokens[0]),
	};
}

export function consumeAllCommentsAndWhitespace(ctx: Context, tokens: Array<CSSToken>): { advance: number, nodes: Array<WhitespaceNode | CommentNode> } {
	const nodes: Array<WhitespaceNode | CommentNode> = [];

	let i = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (tokens[i][0] === TokenType.Whitespace) {
			const result = consumeWhitespace(ctx, tokens.slice(i));
			i += result.advance;
			nodes.push(result.node);
			continue;
		}

		if (tokens[i][0] === TokenType.Comment) {
			nodes.push(new CommentNode(tokens[i]));
			i++;
			continue;
		}

		return {
			advance: i,
			nodes: nodes,
		};
	}
}

export class TokenNode {
	type: ComponentValueType = ComponentValueType.Token;

	value: CSSToken;

	constructor(value: CSSToken) {
		this.value = value;
	}

	tokens(): Array<CSSToken> {
		return [
			this.value,
		];
	}

	toString(): string {
		return stringify(this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	isTokenNode(): this is TokenNode {
		return TokenNode.isTokenNode(this);
	}

	static isTokenNode(x: unknown): x is TokenNode {
		if (!x) {
			return false;
		}

		if (!(x instanceof TokenNode)) {
			return false;
		}

		return x.type === ComponentValueType.Token;
	}
}
