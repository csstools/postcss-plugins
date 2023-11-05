import type { ChildNode, Container, Document } from 'postcss';
import type { NodeList } from '../../node-list';
export declare function childCombinator(list: NodeList): Array<Container<ChildNode> | Document>;
