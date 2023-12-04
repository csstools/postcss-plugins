import { Node } from 'postcss-selector-parser';
type Specificity = {
    a: number;
    b: number;
    c: number;
};
declare function compare(s1: Specificity, s2: Specificity): number;
declare function selectorSpecificity(node: Node): Specificity;
export { Specificity, compare, selectorSpecificity };
