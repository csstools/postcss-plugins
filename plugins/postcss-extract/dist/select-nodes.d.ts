import type { Node, Container } from 'postcss';
import selectorParser from 'postcss-selector-parser';
export declare function extract(container: Container<Node>, selectors: Map<string, selectorParser.Root>): Record<string, Array<Record<string, unknown>>>;
export declare function selectNodesForSingleQuery(container: Container<Node>, selector: selectorParser.Selector, previouslyMatchedNodes: Set<Node>): Set<Node>;
