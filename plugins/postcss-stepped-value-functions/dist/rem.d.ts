import type { Declaration, Result } from 'postcss';
import type { pluginOptions } from './options';
declare const remFunctionCheck = "rem(";
declare function transformRemFunction(decl: Declaration, result: Result, options: pluginOptions): string | undefined;
export { remFunctionCheck, transformRemFunction };
