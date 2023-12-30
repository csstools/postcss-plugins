import { CSSToken, mirrorVariantType, mirrorVariant, stringify, TokenType, isToken, TokenFunction, ParseError } from '@csstools/css-tokenizer';
import { Context } from '../interfaces/context';
import { ComponentValueType } from '../util/component-value-type';
import { walkerIndexGenerator } from '../util/walker-index-generator';

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

export abstract class ContainerNodeBaseClass {
	/**
	 * The contents of the `Function` or `Simple Block`.
	 * This is a list of component values.
	 */
	value: Array<ComponentValue> = [];

	/**
	 * Retrieve the index of the given item in the current node.
	 * For most node types this will be trivially implemented as `this.value.indexOf(item)`.
	 */
	indexOf(item: ComponentValue): number | string {
		return this.value.indexOf(item);
	}

	/**
	 * Retrieve the item at the given index in the current node.
	 * For most node types this will be trivially implemented as `this.value[index]`.
	 */
	at(index: number | string): ComponentValue | undefined {
		if (typeof index === 'number') {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	/**
	 * Iterates over each item in the `value` array of the current node.
	 *
	 * @param cb - The callback function to execute for each item.
	 * The function receives an object containing the current node (`node`), its parent (`parent`),
	 * and an optional `state` object.
	 * A second parameter is the index of the current node.
	 * The function can return `false` to stop the iteration.
	 *
	 * @param state - An optional state object that can be used to pass additional information to the callback function.
	 * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
	 *
	 * @returns `false` if the iteration was halted, `undefined` otherwise.
	 */
	forEach<T extends Record<string, unknown>, U extends ContainerNode>(this: U, cb: (entry: { node: ComponentValue, parent: ContainerNode, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		if (this.value.length === 0) {
			return;
		}

		const indexGenerator = walkerIndexGenerator(this.value);

		let index = 0;
		while (index < this.value.length) {
			const child = this.value[index];

			let stateClone: T | undefined = undefined;
			if (state) {
				stateClone = {
					...state,
				};
			}

			if (cb({ node: child, parent: this, state: stateClone }, index) === false) {
				return false;
			}

			index = indexGenerator(this.value, child, index);
			if (index === -1) {
				break;
			}
		}
	}

	/**
	 * Walks the current node and all its children.
	 *
	 * @param cb - The callback function to execute for each item.
	 * The function receives an object containing the current node (`node`), its parent (`parent`),
	 * and an optional `state` object.
	 * A second parameter is the index of the current node.
	 * The function can return `false` to stop the iteration.
	 *
	 * @param state - An optional state object that can be used to pass additional information to the callback function.
	 * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
	 * However changes are passed down to child node iterations.
	 *
	 * @returns `false` if the iteration was halted, `undefined` otherwise.
	 */
	walk<T extends Record<string, unknown>, U extends ContainerNode>(this: U, cb: (entry: { node: ComponentValue, parent: ContainerNode, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		if (this.value.length === 0) {
			return;
		}

		this.forEach((entry, index) => {
			if (cb(entry, index) === false) {
				return false;
			}

			if ('walk' in entry.node && this.value.includes(entry.node)) {
				if (entry.node.walk(cb, entry.state) === false) {
					return false;
				}
			}
		}, state);
	}
}

/**
 * A function node.
 *
 * @example
 * ```js
 * const node = parseComponentValue(tokenize('calc(1 + 1)'));
 *
 * isFunctionNode(node); // true
 * node.getName(); // 'calc'
 * ```
 */
export class FunctionNode extends ContainerNodeBaseClass {
	/**
	 * The node type, always `ComponentValueType.Function`
	 */
	type: ComponentValueType = ComponentValueType.Function;

	/**
	 * The token for the name of the function.
	 */
	name: TokenFunction;

	/**
	 * The token for the closing parenthesis of the function.
	 * If the function is unclosed, this will be an EOF token.
	 */
	endToken: CSSToken;

	constructor(name: TokenFunction, endToken: CSSToken, value: Array<ComponentValue>) {
		super();

		this.name = name;
		this.endToken = endToken;
		this.value = value;
	}

	/**
	 * Retrieve the name of the current function.
	 * This is the parsed and unescaped name of the function.
	 */
	getName(): string {
		return this.name[4].value;
	}

	/**
	 * Normalize the current function:
	 * 1. if the "endToken" is EOF, replace with a ")-token"
	 */
	normalize() {
		if (this.endToken[0] === TokenType.EOF) {
			this.endToken = [TokenType.CloseParen, ')', -1, -1, undefined];
		}
	}

	/**
	 * Retrieve the tokens for the current function.
	 * This is the inverse of parsing from a list of tokens.
	 */
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

	/**
	 * Convert the current function to a string.
	 * This is not a true serialization.
	 * It is purely a concatenation of the string representation of the tokens.
	 */
	toString(): string {
		const valueString = this.value.map((x) => {
			if (isToken(x)) {
				return stringify(x);
			}

			return x.toString();
		}).join('');

		return stringify(this.name) + valueString + stringify(this.endToken);
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 * This is useful in asserts and to store large ASTs in files.
	 */
	toJSON(): unknown {
		return {
			type: this.type,
			name: this.getName(),
			tokens: this.tokens(),
			value: this.value.map((x) => x.toJSON()),
		};
	}

	/**
	 * @internal
	 */
	isFunctionNode(): this is FunctionNode {
		return FunctionNode.isFunctionNode(this);
	}

	/**
	 * @internal
	 */
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
function consumeFunction(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: FunctionNode } {
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

/**
 * A simple block node.
 *
 * @example
 * ```js
 * const node = parseComponentValue(tokenize('[foo=bar]'));
 *
 * isSimpleBlockNode(node); // true
 * node.startToken; // [TokenType.OpenSquare, '[', 0, 0, undefined]
 * ```
 */
export class SimpleBlockNode extends ContainerNodeBaseClass {
	/**
	 * The node type, always `ComponentValueType.SimpleBlock`
	 */
	type: ComponentValueType = ComponentValueType.SimpleBlock;

	/**
	 * The token for the opening token of the block.
	 */
	startToken: CSSToken;

	/**
	 * The token for the closing token of the block.
	 * If the block is closed it will be the mirror variant of the `startToken`.
	 * If the block is unclosed, this will be an EOF token.
	 */
	endToken: CSSToken;

	constructor(startToken: CSSToken, endToken: CSSToken, value: Array<ComponentValue>) {
		super();

		this.startToken = startToken;
		this.endToken = endToken;
		this.value = value;
	}

	/**
	 * Normalize the current simple block
	 * 1. if the "endToken" is EOF, replace with the mirror token of the "startToken"
	 */
	normalize() {
		if (this.endToken[0] === TokenType.EOF) {
			const mirror = mirrorVariant(this.startToken);
			if (mirror) {
				this.endToken = mirror;
			}
		}
	}

	/**
	 * Retrieve the tokens for the current simple block.
	 * This is the inverse of parsing from a list of tokens.
	 */
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

	/**
	 * Convert the current simple block to a string.
	 * This is not a true serialization.
	 * It is purely a concatenation of the string representation of the tokens.
	 */
	toString(): string {
		const valueString = this.value.map((x) => {
			if (isToken(x)) {
				return stringify(x);
			}

			return x.toString();
		}).join('');

		return stringify(this.startToken) + valueString + stringify(this.endToken);
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 * This is useful in asserts and to store large ASTs in files.
	 */
	toJSON(): unknown {
		return {
			type: this.type,
			startToken: this.startToken,
			tokens: this.tokens(),
			value: this.value.map((x) => x.toJSON()),
		};
	}

	/**
	 * @internal
	 */
	isSimpleBlockNode(): this is SimpleBlockNode {
		return SimpleBlockNode.isSimpleBlockNode(this);
	}

	/**
	 * @internal
	 */
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
function consumeSimpleBlock(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: SimpleBlockNode } {
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
	/**
	 * The node type, always `ComponentValueType.WhiteSpace`
	 */
	type: ComponentValueType = ComponentValueType.Whitespace;

	/**
	 * The list of consecutive whitespace tokens.
	 */
	value: Array<CSSToken>;

	constructor(value: Array<CSSToken>) {
		this.value = value;
	}

	/**
	 * Retrieve the tokens for the current whitespace.
	 * This is the inverse of parsing from a list of tokens.
	 */
	tokens(): Array<CSSToken> {
		return this.value;
	}

	/**
	 * Convert the current whitespace to a string.
	 * This is not a true serialization.
	 * It is purely a concatenation of the string representation of the tokens.
	 */
	toString(): string {
		return stringify(...this.value);
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 * This is useful in asserts and to store large ASTs in files.
	 */
	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isWhitespaceNode(): this is WhitespaceNode {
		return WhitespaceNode.isWhitespaceNode(this);
	}

	/**
	 * @internal
	 */
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

function consumeWhitespace(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: WhitespaceNode } {
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
	/**
	 * The node type, always `ComponentValueType.Comment`
	 */
	type: ComponentValueType = ComponentValueType.Comment;

	/**
	 * The comment token.
	 */
	value: CSSToken;

	constructor(value: CSSToken) {
		this.value = value;
	}

	/**
	 * Retrieve the tokens for the current comment.
	 * This is the inverse of parsing from a list of tokens.
	 */
	tokens(): Array<CSSToken> {
		return [
			this.value,
		];
	}

	/**
	 * Convert the current comment to a string.
	 * This is not a true serialization.
	 * It is purely a concatenation of the string representation of the tokens.
	 */
	toString(): string {
		return stringify(this.value);
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 * This is useful in asserts and to store large ASTs in files.
	 */
	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isCommentNode(): this is CommentNode {
		return CommentNode.isCommentNode(this);
	}

	/**
	 * @internal
	 */
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

function consumeComment(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: CommentNode } {
	return {
		advance: 1,
		node: new CommentNode(tokens[0]),
	};
}

function consumeAllCommentsAndWhitespace(ctx: Context, tokens: Array<CSSToken>): { advance: number, nodes: Array<WhitespaceNode | CommentNode> } {
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
	/**
	 * The node type, always `ComponentValueType.Token`
	 */
	type: ComponentValueType = ComponentValueType.Token;

	/**
	 * The token.
	 */
	value: CSSToken;

	constructor(value: CSSToken) {
		this.value = value;
	}

	/**
	 * This is the inverse of parsing from a list of tokens.
	 */
	tokens(): Array<CSSToken> {
		return [
			this.value,
		];
	}

	/**
	 * Convert the current token to a string.
	 * This is not a true serialization.
	 * It is purely the string representation of token.
	 */
	toString(): string {
		return this.value[1];
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 * This is useful in asserts and to store large ASTs in files.
	 */
	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isTokenNode(): this is TokenNode {
		return TokenNode.isTokenNode(this);
	}

	/**
	 * @internal
	 */
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
