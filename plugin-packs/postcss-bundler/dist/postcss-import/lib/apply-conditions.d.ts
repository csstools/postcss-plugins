import type { AtRule, AtRuleProps } from 'postcss';
import { Stylesheet } from './statement';
export declare function applyConditions(stylesheet: Stylesheet, atRule: (defaults?: AtRuleProps) => AtRule): void;
