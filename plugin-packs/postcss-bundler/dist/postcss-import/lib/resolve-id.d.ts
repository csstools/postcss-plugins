/// <reference types="node" />
import type { Node, Result } from 'postcss';
export declare function resolveId(node: Node, require: NodeRequire, id: string, base: string): string;
export declare function createRequire(node: Node, result: Result): [NodeRequire, string, string] | [];
