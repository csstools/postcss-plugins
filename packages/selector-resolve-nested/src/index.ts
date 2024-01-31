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

export { resolveNestedSelector } from './resolve-nested-selector';
export { desugarNestedSelector } from './desugar-nested-selector';
