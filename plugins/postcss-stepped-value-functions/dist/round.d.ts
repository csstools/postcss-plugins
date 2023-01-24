import type { Declaration, Result } from 'postcss';
import type { pluginOptions } from './options';
declare const roundFunctionCheck = "round(";
declare function transformRoundFunction(decl: Declaration, result: Result, options: pluginOptions): string | undefined;
export { roundFunctionCheck, transformRoundFunction };
