import type { Declaration, Result } from 'postcss';
import type { pluginOptions } from './options';
declare const modFunctionCheck = "mod(";
declare function transformModFunction(decl: Declaration, result: Result, options: pluginOptions): string | undefined;
export { modFunctionCheck, transformModFunction };
