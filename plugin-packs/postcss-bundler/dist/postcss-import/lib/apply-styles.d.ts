import type { Document, Root } from 'postcss';
import { Statement } from './statement';
export declare function applyStyles(bundle: Array<Statement>, styles: Root | Document): void;
