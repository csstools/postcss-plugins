import { CSSToken, mirrorVariantType, stringify, TokenType, isToken, TokenFunction } from '@csstools/css-tokenizer';
import { Context } from '../interfaces/context';

export type ContainerNode = FunctionNode | SimpleBlockNode;

export type ComponentValue = FunctionNode | SimpleBlockNode | WhitespaceNode | CommentNode | TokenNode | UnclosedSimpleBlockNode | UnclosedFunctionNode;

export enum ComponentValueType {
	Function = 'function',
	SimpleBlock = 'simple-block',
	Whitespace = 'whitespace',
	Comment = 'comment',
	Token = 'token',
	UnclosedFunction = 'unclosed-function',
	UnclosedSimpleBlock = 'unclosed-simple-block'
}

// https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
export function consumeComponentValue(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: ComponentValue } {
	const i = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = tokens[i];
		if (
			token[0] === TokenType.OpenParen ||
			token[0] === TokenType.OpenCurly ||
			token[0] === TokenType.OpenSquare
		) {
			const r = consumeSimpleBlock(ctx, tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		if (token[0] === TokenType.Function) {
			const r = consumeFunction(ctx, tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		if (token[0] === TokenType.Whitespace) {
			const r = consumeWhitespace(ctx, tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		if (token[0] === TokenType.Comment) {
			const r = consumeComment(ctx, tokens.slice(i));
			return {
				advance: r.advance + i,
				node: r.node,
			};
		}

		return {
			advance: i + 1,
			node: new TokenNode(token),
		};
	}
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

	get nameTokenValue(): string {
		return this.name[4].value;
	}

	tokens() {
		return [
			this.name,
			...this.value.flatMap((x) => {
				if (isToken(x)) {
					return x;
				}

				return x.tokens();
			}),
			this.endToken,
		];
	}

	toString() {
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

	at(index: number | string) {
		if (typeof index === 'number') {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	walk(cb: (entry: { node: ComponentValue, parent: ContainerNode }, index: number | string) => boolean) {
		let aborted = false;

		this.value.forEach((child, index) => {
			if (aborted) {
				return;
			}

			if (cb({ node: child, parent: this }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child) {
				if (child.walk(cb) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name[4].value,
			tokens: this.tokens(),
		};
	}
}

// https://www.w3.org/TR/css-syntax-3/#consume-function
export function consumeFunction(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: FunctionNode | UnclosedFunctionNode } {
	const value: Array<ComponentValue> = [];

	let i = 1;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const token = tokens[i];
		if (!token || token[0] === TokenType.EOF) {
			ctx.onParseError({
				message: 'Unexpected EOF while consuming a function.',
				start: tokens[0][2],
				end: tokens[tokens.length - 1][3],
				state: [
					'5.4.9. Consume a function',
					'Unexpected EOF',
				],
			});

			return {
				advance: tokens.length,
				node: new UnclosedFunctionNode(tokens),
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

	tokens() {
		return [
			this.startToken,
			...this.value.flatMap((x) => {
				if (isToken(x)) {
					return x;
				}

				return x.tokens();
			}),
			this.endToken,
		];
	}

	toString() {
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

	at(index: number | string) {
		if (typeof index === 'number') {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	walk(cb: (entry: { node: ComponentValue, parent: ContainerNode }, index: number | string) => boolean) {
		let aborted = false;

		this.value.forEach((child, index) => {
			if (aborted) {
				return;
			}

			if (cb({ node: child, parent: this }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child) {
				if (child.walk(cb) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON() {
		return {
			type: this.type,
			startToken: this.startToken,
			tokens: this.tokens(),
		};
	}
}

/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
export function consumeSimpleBlock(ctx: Context, tokens: Array<CSSToken>): { advance: number, node: SimpleBlockNode | UnclosedSimpleBlockNode } {
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
			ctx.onParseError({
				message: 'Unexpected EOF while consuming a simple block.',
				start: tokens[0][2],
				end: tokens[tokens.length - 1][3],
				state: [
					'5.4.8. Consume a simple block',
					'Unexpected EOF',
				],
			});

			return {
				advance: tokens.length,
				node: new UnclosedSimpleBlockNode(tokens),
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

	tokens() {
		return this.value;
	}

	toString() {
		return stringify(...this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
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

	tokens() {
		return [
			this.value,
		];
	}

	toString() {
		return stringify(this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
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

	tokens() {
		return [
			this.value,
		];
	}

	toString() {
		return stringify(this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}
}

export class UnclosedFunctionNode {
	type: ComponentValueType = ComponentValueType.UnclosedFunction;

	value: Array<CSSToken>;

	constructor(value: Array<CSSToken>) {
		this.value = value;
	}

	tokens() {
		return this.value;
	}

	toString() {
		return stringify(...this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}
}

export class UnclosedSimpleBlockNode {
	type: ComponentValueType = ComponentValueType.UnclosedSimpleBlock;

	value: Array<CSSToken>;

	constructor(value: Array<CSSToken>) {
		this.value = value;
	}

	tokens() {
		return this.value;
	}

	toString() {
		return stringify(...this.value);
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}
}
