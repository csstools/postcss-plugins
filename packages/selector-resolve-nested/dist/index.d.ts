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

import type { Root } from 'postcss-selector-parser';

/**
 * Resolve a nested selector against a given parent selector.
 *
 * @param selector - The selector to resolve.
 * @param parentSelector - The parent selector to resolve against.
 * @returns The resolved selector.
 */
export declare function resolveNestedSelector(selector: Root, parentSelector: Root): Root;

export { }
