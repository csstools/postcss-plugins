import type { Result, Rule } from 'postcss';
export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result): void;
export declare function isValidRuleWithinRule(node: Rule): boolean;
