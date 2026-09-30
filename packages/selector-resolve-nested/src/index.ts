/**
 * Resolve nested selectors following the CSS nesting specification.
 *
 * @example
 *
 * ```js
 * import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
 * import parser from 'postcss-selector-parser';
 *
 * const selector = parser().astSync('.foo &');
 * const parent = parser().astSync('.bar');
 *
 * // .foo .bar
 * console.log(
 *   resolveNestedSelector(selector, parent).toString()
 * )
 * ```
 *
 * @packageDocumentation
 */

export type { ResolveOptions } from './resolve-nested-selector';
export { resolveNestedSelector } from './resolve-nested-selector';
export { flattenNestedSelector } from './flatten-nested-selector';
