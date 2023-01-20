import type { Container } from 'postcss';
export type walkFunc = (node: Container, opts: {
    noIsPseudoSelector: boolean;
}) => void;
