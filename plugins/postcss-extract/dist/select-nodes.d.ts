import type { Node, Container } from 'postcss';
import type selectorParser from 'postcss-selector-parser';
export declare function extract(container: Container<Node>, selectors: Map<string, selectorParser.Root>): Record<string, Array<Record<string, unknown>>>;
