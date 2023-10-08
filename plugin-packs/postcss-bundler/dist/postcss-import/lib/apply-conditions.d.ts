import type { AtRule, AtRuleProps } from 'postcss';
import { Statement } from './statement';
export declare function applyConditions(bundle: Array<Statement>, atRule: (defaults?: AtRuleProps) => AtRule): void;
