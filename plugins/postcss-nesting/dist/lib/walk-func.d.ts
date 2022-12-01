import type { Container, Result } from 'postcss';
export declare type walkFunc = (node: Container, result: Result, opts: {
    noIsPseudoSelector: boolean;
}) => void;
