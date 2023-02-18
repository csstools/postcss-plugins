import type { Declaration, Result } from 'postcss';
import type { FunctionNode } from 'postcss-value-parser';
export declare function onCSSFunctionSRgb(node: FunctionNode): void;
export declare function onCSSFunctionDisplayP3(node: FunctionNode, decl: Declaration, result: Result, preserve: boolean): void;
