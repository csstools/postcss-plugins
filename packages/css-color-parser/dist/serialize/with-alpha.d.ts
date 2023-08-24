import { ColorData } from '../color-data';
import type { TokenFunction, TokenWhitespace } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
export declare function serializeWithAlpha(color: ColorData, fn: TokenFunction, space: TokenWhitespace, channels: Array<TokenNode | WhitespaceNode>): FunctionNode;
