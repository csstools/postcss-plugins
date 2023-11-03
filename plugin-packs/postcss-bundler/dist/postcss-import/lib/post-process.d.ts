import type { AtRule, AtRuleProps } from 'postcss';
import { Stylesheet } from './statement';
export declare function postProcess(stylesheet: Stylesheet, atRule: (defaults?: AtRuleProps) => AtRule): void;
