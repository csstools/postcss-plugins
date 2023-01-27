import { options } from '../options';
import type { Node, Result } from 'postcss';
export default function mergeSelectors(node: Node, postcssResult: Result, fromSelectors: Array<string>, toSelectors: Array<string>, opts: options, fromAtNest?: boolean): any[];
